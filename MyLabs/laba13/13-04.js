const net = require('net');

const HOST = '127.0.0.1';
const PORT = 3000;

const tcpClient = new net.Socket();

tcpClient.connect(PORT, HOST, () => {

    tcpClient.on('data', data => {
        console.log(data.readInt32LE());
    });

    let number = 0;
    let buffer = new Buffer.alloc(4);
    const handlerInterval  = setInterval(() => {
        const bufferNumber = buffer.writeInt32LE(number++,0);
        tcpClient.write((bufferNumber,buffer));
    }, 1000);

    setTimeout(() => {
        clearInterval(handlerInterval);
        tcpClient.destroy();
    }, 20000);
});

tcpClient.on('close', () => {
    console.log('Connection closed');
});
tcpClient.on('error', err => {
    console.log(err);
});
