const webSocket = require('ws');
const PORT = 4000;

const serverWS = new webSocket.Server({port: PORT}, () => {
    console.log(`WS started on port ${PORT}...`);
});

serverWS.on('connection', (ws) => {
    ws.on('pong', data => {
        console.log(`PONG! Message{${data.toString()}}`, )
    });
});


let count = 0;
const fifteenSeconds = 15 * 1000;
const fiveSeconds = 5 * 1000;

setInterval(() => {
    serverWS.clients.forEach(client => {
        client.send(`11-03-server: ${++count}\n`);
    });
}, fifteenSeconds);


setInterval(() => {
    serverWS.clients.forEach(client => {
        client.ping('server: ping');
    });
    console.log(`server: ping, ${serverWS.clients.size} connected clients`)
}, fiveSeconds);

