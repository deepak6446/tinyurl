const crypto = require('crypto')
const { wait } = require("../utils")
const urlMeta = require("../models/urlMeta");
const redisClient = require("./redisConnect").client
const lean = {
    lean: true
};
const {
    OK,
    shortUrlNotFound
} = require('../message')
  
const encoderUrl = (key) => {
    return crypto.createHash('md5').update(key).digest('base64').replace(/\//g, '_').replace(/\+/g, '-') 
}

/**
 * 
 * @param {*} shortUrl: substring of hash value
 * @param {*} longUrl 
 * 
 * try saving in mongoDB, if dublicate short url is found return error
 * 
 * @returns [shortUrl, mongoError]
 */
const storeInMongoDB = async(shortUrl, longUrl) => {
    shortUrl = global.domain + shortUrl
    let urlmeta = new urlMeta({ shortUrl,  longUrl});
    let [err, _] = await wait(urlmeta.save, urlmeta, lean);
    let mongoErr = true
    //duplicate key
    if (err && err.code == 11000) {
        console.error("dublicate records found for url: ",shortUrl);
        console.log('degug------------', shortUrl, !mongoErr)
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

const redisStore = async (shortUrl, longUrl) => {
    let [err, _] = await wait(redisClient.setAsync, redisClient, shortUrl, longUrl)
    if(err) {
        console.error("error in redis: ", err)
    }
}

const redisGet = async (shortUrl) => {
    let [err, data] = await wait(redisClient.getAsync, redisClient, shortUrl)
    if(err) {
        console.error("error in redis: ", err)
    }else if(!data) {
        console.error("short url not found in redis: ")
    }
    return data
}

const getUrlMongo = async (shortUrl) => {
    
    shortUrl = global.domain + shortUrl

    let redisData = await redisGet(shortUrl)
    if(redisData && redisData.length) {
        return [OK.status, {url: redisData}, {url: redisData}];
    }

    let find = {shortUrl}
    let [err, data] = await wait(urlMeta.findOne, urlMeta, find, null, lean);
    if (err) {
        console.error("Error in mongo:", err);
        return [mongoError.status, mongoError.response, null];
    } else if (!data) {
        console.error(
        `shortUrl ${shortUrl} not found in DB`
        );
        return [shortUrlNotFound.status, shortUrlNotFound.response, data];
    }
    return [Ok.status, {url: redisData}, {url: redisData}];
}

module.exports= {
    encoderUrl,
    storeInMongoDB,
    getUrlMongo
}