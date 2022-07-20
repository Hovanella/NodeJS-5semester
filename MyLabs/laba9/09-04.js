const http = require('http');
const params = JSON.stringify(
    {
        __comment: "Запрос.Лабораторная работа 8/10",
        x: 1,
        y: 2,
        s:"Сообщение",
        m:["a", "b", "c","d"],
        o:{"surname":"Иванов",name : "Иван"}
    }
);
const option = {
    host: 'localhost',
    path: '/task4',
    port: 3000,
    method: 'POST',
    headers: { 'content-type':'application/json', 'accept':'application/json' }
};

http.request(option, res => {
    console.log('http.request: statusCode: ', res.statusCode);

    res.on('data', (data) => {
        console.log('body:', data.toString());
    });
}).end(params);