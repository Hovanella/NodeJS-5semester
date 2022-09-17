/*
Разработайте серверное приложение 01-03, на основе разработанных в задании 2, которое в ответе сервера пересылает html-страницу содержимым запроса (метод, uri,... ).*/

const http = require('http');

const getRequestHeadersWithValues = request => {

    let headersWithValues = '';

    for (let header in request.headers) {

        const key = `<span style="color : red">${header}</span>`;
        const value = `<span style="color : green">${request.headers[header]}</span>`;
        headersWithValues += `${key} : ${value} <br>`;

    }

    return headersWithValues;
};

http.createServer((request, response) => {

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    let body = '';
    request.on('data', chunk => {
        body = body.concat(chunk);
    });

    request.on('end', () => response.end(
        `<!DOCTYPE html> 
             <html lang="en">
             <head>
             <title>01-03</title>
              </head>
              <body  style="background:#f5f5f5;font-size:30px ">
              <p>method: ${request.method}</p>
              <p>url: ${request.url}</p> 
              <p>version: ${request.httpVersion}</p>
              <p>HEADERS:<br>{<br> ${getRequestHeadersWithValues(request)} <br>}</p>
              <p>body: ${body}</p>
              </body>
              </html>`
        )
    )
}).listen(5000);

console.log('Server running at http://localhost:5000/');