/***
 * connect to redis and return redis client
 */
const redis = require("redis");
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(6379, 'redis');


client.on("error", function (err) {
    console.log("Error " + err);
});

client.getAsync('foo').then((res)=>{
    console.log('Redis Connected', res)
});

module.exports = {
    client
}