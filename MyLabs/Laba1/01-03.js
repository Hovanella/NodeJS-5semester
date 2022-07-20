/*
Разработайте серверное приложение 01-03, на  основе разработанных  в  задании  2,  котороев  ответе  сервера пересылает html-страницус содержимым запроса (метод, uri,... ).*/

const http = require('http');

const getRequestHeadersWithValues = request => {
    let rc = '';
    for (let key in request.headers) {
        rc += `<br><br>${key}: ${request.headers[key]}`;
    }

    return rc;
};

http.createServer((request, response) => {

    let body = '';

    request.on('data', chunk => {
        body += chunk;
        console.log('data', body);
    });

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    request.on('end', () => response.end(
            `<!DOCTYPE html> 
             <html lang="en">
             <head>
             <title>Lab1</title>
              </head>
              <body style="background: whitesmoke">
              <h1>REQUEST</h1>
              <p>method: ${request.method}</p>
              <p>uri: ${request.url}</p>
              <p>version: ${request.httpVersion}</p>
              <p>HEADERS: ${getRequestHeadersWithValues(request)}</p>
              <p>body: ${body}</p>
              </body>
              </html>`
        )
    )
}).listen(3000);

console.log('Server running at http://localhost:3000/');