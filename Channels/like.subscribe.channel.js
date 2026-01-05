const bullRedis = require('../connections/redis.bull');


async function subscribeToLikeFlushChannel() {

    await bullRedis.subscribe('mass-like-flush');
    
    bullRedis.on('message', (channel, message) => {
        const now = new Date();
        const currentDateTime = now.toLocaleString();
        const data = JSON.parse(message);
        console.log(`[${currentDateTime}] Received message on channel ${channel}: ${data.message}`);
    });
}

subscribeToLikeFlushChannel();