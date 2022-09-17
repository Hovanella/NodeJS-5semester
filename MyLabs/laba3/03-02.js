const http = require("http");
const url = require("url");
const fs = require("fs");

const factorial = (n) => n <= 1 ? n : n * factorial(n - 1);

http.createServer((request, response) => {

    console.log(request.url);
    let path = url.parse(request.url, true);

    switch (path.pathname) {
        case '/fact':

            const k = +path.query.k;

            if (Number.isInteger(k) && k >= 0) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({k: k, fact: factorial(k)}));
            } else {
                response.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
                response.end("Неверный параметр");
            }
            break;
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('03-03.html'));
            break;

    }
}).listen(3000);

console.log('Start server at http://localhost:3000/fact?k=3');