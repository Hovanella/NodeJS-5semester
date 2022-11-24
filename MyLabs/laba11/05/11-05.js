const rpcWS = require('rpc-websockets').Server;
const config = {port: 4000, host: 'localhost', path: '/'};

const server = new rpcWS(config);
server.setAuth(l => l.login === '123' && l.password === '123');

server.register('square', square).public();
server.register('sum', sum).public();
server.register('mul', mul).public();

server.register('fib', fib).protected();
server.register('fact', fact).protected();

function square(params) {

    switch (params.length) {
        case 1:
            const radius = params[0];
            return Math.pow(radius, 2) * Math.PI;
        case 2:
            const length = params[0]; const width = params[1];
            return length * width;
        default:
            return 'wrong params';
    }
}

function sum(params) {
    return params.reduce((sum, nextItem) => sum + nextItem, 0);
}

function mul(params) {
    return params.reduce((mul, nextItem) => mul * nextItem, 1);
}

function fib(n) {
    if (isNaN(n) || n <=0) {
        return 'wrong params';
    }
    else{
        if (+n === 1 ) {
            return [0];
        }
        let fibArray = [0, 1];
        for (let i = 2; i < +n; i++) {
            fibArray.push(fibArray[i - 2] + fibArray[i - 1]);
        }
        return fibArray;
    }
}

function fact(n) {
    if (n <= 1) {
        return 1;
    }
    return n * fact(n - 1);
}

