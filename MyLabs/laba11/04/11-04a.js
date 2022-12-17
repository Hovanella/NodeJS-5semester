const webSocket = require('ws');

const ws = new webSocket('ws://localhost:4000/');
const webSocketStream = webSocket.createWebSocketStream(ws);


const client = process.argv[2];
const body = {client: client, timestamp: new Date().toISOString()};

ws.onopen = () => {
    ws.send(JSON.stringify(body));

    ws.on('message', message => {
        const parsedMessage = JSON.parse(message);

        console.log(`{n:${parsedMessage.n} client:${parsedMessage.client}, timestamp:${parsedMessage.timestamp}}`);
    });
};

