const Promise = require('bluebird')
const redis = Promise.promisifyAll(require('redis'));
const client = redis.createClient();
console.log("Successfully connected to Redis Cache Database")
module.exports = client