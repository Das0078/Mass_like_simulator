const axios = require("axios");

const LIKE_URL = "http://localhost:4000/like";
const POST_ID = "695382708136593e49cde546";

const TOTAL_LIKES = 10000;
const CONCURRENCY = 500; // increase if machine can handle it

async function sendBatch(batchSize) {
  const requests = [];

  for (let i = 0; i < batchSize; i++) {
    requests.push(
      axios.post(
        LIKE_URL,
        { postId: POST_ID },
        { headers: { "Content-Type": "application/json" } }
      ).catch(() => {}) // ignore failures for stress test
    );
  }

  await Promise.all(requests);
}

async function simulateMassLikes() {
  console.time("🔥 Mass Likes");

  let sent = 0;

  while (sent < TOTAL_LIKES) {
    const batchSize = Math.min(CONCURRENCY, TOTAL_LIKES - sent);
    await sendBatch(batchSize);
    sent += batchSize;
  }

  console.timeEnd("🔥 Mass Likes");
  console.log(`✅ Sent ${sent} likes`);
}

simulateMassLikes();
