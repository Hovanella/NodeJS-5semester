const http = require("http");
const url = require("url");
const fs = require("fs");

const factorial = (n) => n <= 1 ? n : n * factorial(n - 1);

http.createServer(async (request, response) => {

    console.log(request.url);
    let path = url.parse(request.url, true);

    switch (path.pathname) {
        case '/fact':

            const k = +path.query.k;

            if (Number.isInteger(k) && k >= 0) {

                let k = +path.query.k;

                process.nextTick(() => {
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    response.end(JSON.stringify({k: k, fact: factorial(k)}));
                });


            } else {
                console.log("Неверный параметр");
            }
            break;
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('03-03.html'));
            break;

    }
}).listen(3000);

console.log('Start server at http://localhost:3000/fact?k=3');