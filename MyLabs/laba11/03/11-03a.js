const webSocket = require('ws');

const ws = new webSocket('ws://localhost:4000/');
const webSocketStream = webSocket.createWebSocketStream(ws);

ws.on('ping', (data) => {
    console.log('PING', data.toString());
});

webSocketStream.pipe(process.stdout);