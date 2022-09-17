const http = require("http");
const fs = require("fs");

const PORT = 3000;

http.createServer( (request, response) => {

    const url = request.url;

    switch (url) {
        default:
        case "/html": {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            readFileAndFinishResponse("index.html", response);
            break;
        }
        case "/png": {
            response.writeHead(200, {'Content-Type':'image/png'});
            readFileAndFinishResponse("OP3CQjxWBwg.jpg", response);
            break;
        }
        case "/api/name": {
            response.writeHead(200, {
                'Content-Type': 'text/plain',
            });
            response.end("Hovanskii Timofei Alexandrovich");
            break;
        }
        case "/xmlhttprequest": {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            readFileAndFinishResponse("xmlhttprequest.html", response);
            break;
        }
        case "/fetch": {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            readFileAndFinishResponse("fetch.html", response);
            break;
        }
        case "/jquery": {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            readFileAndFinishResponse("jquery.html", response);
            break;
        }
    }
}).listen(PORT, () => {
    console.log(`'Server is running at http://localhost:${PORT}/'`);
});


const readFileAndFinishResponse = (fileName, response) => {

    let filePath = "./" + fileName;
    fs.readFile(filePath, (error, data) => {
        if (error) {
            console.error(error);
        }
        response.end(data);
    });
}