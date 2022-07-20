const net = require('net');
const PORT = 40000;

const tcpServer = net.createServer();

tcpServer.on('connection', socket => {
    let sum = 0;
    socket.on('data', data => {
        console.log(data.toString());
        sum += +data;
    });

    const handlerInterval = setInterval(() => {
        console.log(`sum: ${sum}`);
        socket.write(`SUM: ${sum}`);
    }, 2100);

    socket.on('close', () => {
        clearInterval(handlerInterval);
    });
});

tcpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});