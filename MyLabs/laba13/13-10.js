const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const PORT = 3000;

client.on('message', (message) => {
    console.log(message.toString());
    client.close();
});

client.send('Hello', PORT, 'localhost', err => {
    if (err) {
        client.close();
    }
});
