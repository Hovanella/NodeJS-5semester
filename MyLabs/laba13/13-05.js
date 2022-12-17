const net = require('net');
const PORT = 3000;

const tcpServer = net.createServer().listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});

tcpServer.on('connection', socket => {

    let sum = 0;

    socket.on('data', data => {
        const clientNumber = data.readInt32LE();
        sum += clientNumber;
        console.log(`Server data : number from server : ${clientNumber} sum : ${sum}`);
    });

    let buffer = Buffer.alloc(4);
    setInterval(() => {
        const bufferedNumber =buffer.writeInt32LE(sum, 0);
        console.log(`Server data : number to client : ${sum}`);
        socket.write((bufferedNumber,buffer));
    }, 5000);

    socket.on('close', () => {
        console.log('Connection closed');
    })

});

tcpServer.on('error', err => {
    console.log(err);
});
tcpServer.on('close', () => {
    console.log('Server closed');
});