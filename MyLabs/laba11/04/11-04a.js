const webSocket = require('ws');

const ws = new webSocket('ws://localhost:4000/');
const webSocketStream = webSocket.createWebSocketStream(ws);

webSocketStream.pipe(process.stdout);

const client = process.argv[2];
const body = {client: client, timestamp: new Date().toISOString()};

ws.onopen = () => {
    ws.send(JSON.stringify(body));
};

