const crypto = require('crypto')
const { wait } = require("../utils")
const urlMeta = require("../models/urlMeta");
const redisClient = require("../config/redisConnect").client
const lean = {
    lean: true
};
const {
    OK,
    shortUrlNotFound
} = require('../message')
  
/**
 * 
 * @param {*} key: long url 
 * 
 * use md5 algorithm to create a hash of long url
 * convert to base64 which will return 24 characters
 */
const encoderUrl = (key) => {
    return crypto.createHash('md5').update(key).digest('base64').replace(/\//g, '_').replace(/\+/g, '-') 
}

/**
 * 
 * @param {*} shortUrl: substring of hash value
 * @param {*} longUrl: long url passed by user
 * 
 * Try saving short url in mongoDB
 * If dublicate short url is found return short url as false to retry storing
 * 
 * @returns [shortUrl, mongoError]
 */
const storeInMongoDB = async(shortUrl, longUrl) => {
    shortUrl = process.env.domain + shortUrl
    let urlmeta = new urlMeta({ shortUrl,  longUrl});
    let [err, _] = await wait(urlmeta.save, urlmeta, lean);
    let mongoErr = true
    //duplicate key
    if (err && err.code == 11000) {
        console.error("dublicate records found for url: ",shortUrl);
        return [false, !mongoErr]
    }else if(err){
        console.error("Error in mongo:", err);
        return [false, mongoErr];
    } else {
        console.info("short url stored successfully")
        await redisStore(shortUrl, longUrl)
        return [shortUrl, !mongoErr]        
    }
    
}

// store data in redis
const redisStore = async (shortUrl, longUrl) => {
    let [err, _] = await wait(redisClient.setAsync, redisClient, shortUrl, longUrl)
    if(err) {
        console.error("error in redis: ", err)
    }
}

// get data from redis
const redisGet = async (shortUrl) => {
    let [err, data] = await wait(redisClient.getAsync, redisClient, shortUrl)
    if(err) {
        console.error("error in redis: ", err)
    }else if(!data) {
        console.error("short url not found in redis.")
    }
    return data
}

/**
 * 
 * @param {*} shortUrl: short url provided by user
 * 
 * find longUrl in redis
 * if not found find in mongodb 
 * if data is there in mongodb store in redis 
 * frequentely data fetched will be stored in redis
 * 
 */
const getUrlMongo = async (shortUrl) => {
    
    shortUrl = process.env.domain + shortUrl

    let redisData = await redisGet(shortUrl)
    if(redisData && redisData.length) {
        return [OK.status, {url: redisData}, {url: redisData}];
    }

    let find = {shortUrl}
    let [err, data] = await wait(urlMeta.findOne, urlMeta, find, null, lean);
    if (err) {
        console.error("Error in mongo:", err);
        return [mongoError.status, mongoError.response, null];
    } else if (!data || !Object.keys(data).length) {
        console.error(
        `shortUrl ${shortUrl} not found in DB`
        );
        return [shortUrlNotFound.status, shortUrlNotFound.response, data];
    }
    await redisStore(data.shortUrl, data.longUrl);
    return [OK.status, {url: data.longUrl}, {url: data.longUrl}];
}

module.exports= {
    encoderUrl,
    storeInMongoDB,
    getUrlMongo
}