const net = require('net');

const HOST = '127.0.0.1';
const parameter = process.argv[2];

const tcpClient = new net.Socket();

const buffer = Buffer.alloc(4);

tcpClient.connect(+parameter, HOST, () => {
    tcpClient.on('data', data => {
        console.log(data.toString());
    });

    const handlerInterval  = setInterval(() => {
        tcpClient.write((buffer.writeUint32LE(parameter,0),buffer));
    }, 1000);

    setTimeout(() => {
        clearInterval(handlerInterval);
        tcpClient.destroy();
    }, 20000);
});