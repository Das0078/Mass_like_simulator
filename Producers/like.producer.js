// batchProducer.js
const redis = require("../connections/redis");
const likeQueue = require("../Queues/like.queue");
const bullRedis = require('../connections/redis.bull');


async function flushLikesToQueue() {
  const keys = await redis.keys("like:post:*");

  if (!keys.length) return;

  const jobs = [];

  for (const key of keys) {
    const postId = key.split(":")[2];
    const count = parseInt(await redis.get(key));

    if (count > 0) {
      jobs.push({
        name: "flush-likes",
        data: { postId, count }
      });
    }

    await redis.del(key);
  }

  if (jobs.length) {
    await likeQueue.addBulk(jobs);
    console.log(`🚀 Flushed ${jobs.length} posts to queue`);

    bullRedis.publish('mass-like-flush', JSON.stringify({ flushedJobs: jobs.length, message: `${jobs.length} likes added to queue` }) );
  }
}

setInterval(flushLikesToQueue, 5000);
