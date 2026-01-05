const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const redis = require('./connections/redis');
const bullRedis = require('./connections/redis.bull');
const Post = require('./connections/mongoDB')

const app = express();

mongoose.connect("mongodb://localhost:27017/likes-demo");

app.use(cors(
  {
    origin: '*'
  }
));
app.use(express.json());


app.get("/events", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  bullRedis.subscribe("mass-like-flush");

  bullRedis.on("message", (_, message) => {
    sendEvent(JSON.parse(message));
  });

  req.on("close", () => {
    bullRedis.unsubscribe("mass-like-flush");
  });
});

app.post("/like", async (req, res) => {
const {postId} = req.body;
if(!postId){
    return res.status(400).json({message:'postId is required'});
}

await redis.incr(`like:post:${postId}`);

// const foundPost = await Post.findById(postId);

// if(!foundPost){
//     res.status(404).json({message:'Post not found'})
// }
// foundPost.likes +=1;

// await foundPost.save();

    res.status(200).json({ message: "❤️ Like recorded (Redis)"});

}); 

app.post("/posts", async (req, res) => {
  try {

    const post = await Post.create({
      title:"Demo Post",
      likes: 0
    });

    res.status(201).json({
      message: "✅ Post created",
      post
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})

