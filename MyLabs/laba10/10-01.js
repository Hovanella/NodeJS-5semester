const http = require('http');
const fs = require('fs');
const {write400} = require('./response');
const portServer = 3000;

const WebSocket = require("ws");
const PORT = 4000;
const server = new WebSocket.Server({port: PORT}, () => {console.log(`WebSocket-server started http://localhost:${PORT}`)});

server.on("connection", ws => {
    let countMessages = 0;
    let countMessagesFromClient;

    ws.on("message", message => {
        console.log(message.toString());
        countMessagesFromClient = message.toString().split(' ')[1];
    });

    ws.onclose = event => console.log(event.code, event.reason);

    setInterval(() => {
        ws.send(`10-01-server: ${countMessagesFromClient}->${countMessages++}`);
    }, 5000);

});

http.createServer((req, res) => {
    switch (req.url) {
        case '/start':
            fs.createReadStream('./views/index.html').pipe(res);
            break;
        default:
            write400(req, res);
    }
})
    .listen(portServer, () => {
        console.log(`HTTP-Server started http://localhost:${portServer}`);
    });