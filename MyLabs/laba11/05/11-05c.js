const {parallel} = require("async");
const rpcWS = require('rpc-websockets').Client;
const ws = new rpcWS('ws://localhost:4000/');


const square_3 = async () => {
    return await ws.call('square', [3]);
}

const square_5_4 = async () => {
    return await ws.call('square', [5, 4]);
}

const fib_7 = async () => {
    return await ws.call('fib', [7]);
}

const mul_3_5_7_9_11_13 = async () => {
    return await ws.call('mul', [3, 5, 7, 9, 11, 13]);
}

let DoIt = async () => {
    await ws.login({login: '123', password: '123'});
    const result = await parallel({
        square_3,
        square_5_4,
        fib_7,
        mul_3_5_7_9_11_13
    });

    const sum = await ws.call('sum', [result.square_3, result.square_5_4, result.mul_3_5_7_9_11_13]);

    const arrayElementsSum = await ws.call('sum', result.fib_7);

    const multiplication = await ws.call('mul', [sum, arrayElementsSum]);

    const finalSum = await ws.call('sum', [multiplication, sum]);

    console.log(finalSum);
    ws.close();
};

ws.on('open', DoIt)

