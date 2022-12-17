const webSocket = require('ws');
const PORT = 4000;

const serverWS = new webSocket.Server({port: PORT}, () => {
    console.log(`Server started on port ${PORT}...`);
});


let count = 0;

serverWS.on('connection', ws => {

    ws.on('message', message => {
        const messageObj = JSON.parse(message);
        console.log(`{client:${messageObj.client}, timestamp:${messageObj.timestamp}}`);

        const body = {n: ++count, client: messageObj.client, timestamp: new Date().toISOString()};
        ws.send(`${JSON.stringify(body)}\n`);

    })

});

