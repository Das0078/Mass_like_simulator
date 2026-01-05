const {Queue} = require('bullmq');
const bullRedis = require('../connections/redis.bull');
const likeQueue = new Queue('like-batch-queue',{
    
        connection:bullRedis
    
})

module.exports = likeQueue;