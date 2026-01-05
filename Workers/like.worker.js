// worker.js
const { Worker } = require("bullmq");
const mongoose = require("mongoose");
const Post = require("../connections/mongoDB");
const bullRedis = require('../connections/redis.bull');

mongoose.connect("mongodb://localhost:27017/likes-demo");

const worker = new Worker(
  "like-batch-queue",
  async (job) => {
    const { postId, count } = job.data;

    await Post.updateOne(
      { _id: postId },
      { $inc: { likes: count } }
    );

    console.log(`✅ Updated post ${postId} with +${count} likes`);
    bullRedis.publish('mass-like-flush', JSON.stringify({count, message:`Updated post ${postId} with +${count} likes to DB`}) );
  },
  {
    connection: {
      host: "localhost",
      port: 6379
    }
  }
);
