const WebSocket = require("ws");
const port = 4000;
const server = new WebSocket.Server({port}, () => {console.log(`WS started on port ${port}...`)});

server.on("connection", webSocket => {
    webSocket.on("message", message => {
        console.log(`Server ${message.toString()}`);
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        })
    });
    webSocket.onclose = event => console.log(event.code, event.reason);
});
