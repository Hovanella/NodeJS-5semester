const webSocket = require('ws');
const fs = require('fs');
const port = 4000;

new webSocket.Server({port}, () => {
    console.log(`WS started on port ${port}...`)
}).on('connection', ws => {
    const webSocketStream = webSocket.createWebSocketStream(ws);
    const file = fs.createWriteStream(`../upload/fileFromClient.txt`);
    webSocketStream.pipe(file);
});
