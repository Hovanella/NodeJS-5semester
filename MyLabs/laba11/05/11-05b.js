const async = require('async');
const rpcWS = require('rpc-websockets').Client;

const ws = new rpcWS('ws://localhost:4000/');


const square_3 = async () => ws.call('square', [3]);
const square_5_4 = async () => ws.call('square', [5, 4]);
const sum_2 = async () => ws.call('sum', [2]);
const sum_2_4_6_8_10 = async () => ws.call('sum', [2, 4, 6, 8, 10]);
const mul_3 = async () => ws.call('mul', [3]);
const mul_3_5_7_8_11 = async () => ws.call('mul', [3, 5, 7, 9, 11, 13]);
const fib_1 = async () => ws.call('fib', [1]);
const fact_0 = async () => ws.call('fact', [0]);
const fact_5 = async () => ws.call('fact', [5]);
const fact_10 = async () => ws.call('fact', [10]);

const login = async () => await ws.login({login: '123', password: '123'});

const MakeParallelExecution = async () => {
    await login();
    const result = await async.parallel(
        [square_3, square_5_4, sum_2, sum_2_4_6_8_10, mul_3, mul_3_5_7_8_11, fib_1, fact_0, fact_5, fact_10]);
    console.log(result);
    ws.close();
};

ws.on('open', MakeParallelExecution);