// redis.js
const { createClient } = require("redis");

const redis = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379
  }
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redis.connect();

module.exports = redis;
