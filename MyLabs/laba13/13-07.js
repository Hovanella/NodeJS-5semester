const net = require('net');
const PORT40000 = 40000;
const PORT50000 = 50000;

const clientProcessing = socket => {
    socket.on('data', data => {
        const number = data.readInt32LE();
        console.log(`message from client: "${number}"`);
        socket.write(`ECHO: ${number}`);
    });
};

net.createServer(clientProcessing).listen(PORT40000, () => { console.log(`TCP-server listening on port ${PORT40000}...`) });
net.createServer(clientProcessing).listen(PORT50000, () => { console.log(`TCP-server listening on port ${PORT50000}...`) });
