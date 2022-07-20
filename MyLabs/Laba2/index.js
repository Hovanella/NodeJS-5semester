const http = require("http");
const fs = require("fs");
const path = require("path")
const PORT = 3000;

const server = http.createServer( (req, res) => {

    const url = req.url;

    console.log(url);
    switch (url) {
        case "/html": {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            direct("index.html", res);
            break;
        }
        case "/png": {
            res.writeHead(200, {'Content-Type':'image/png'});
            direct("pic.png", res);
            break;
        }
        case "/api/name": {
            res.writeHead(200, {
                'Content-Type': 'text/plain',
            });
            res.end("Hovanskii Timofei Alexandrovich");
            break;
        }
        case "/xmlhttprequest": {
            direct("xmlhttprequest.html", res);
            break;
        }
        case "/fetch": {
            direct("fetch.html", res);
            break;
        }
        case "/jquery": {
            direct("jquery.html", res);
            break;
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server has been started on ${PORT}...`);
});

function direct(fileName, response) {
    let filePath = path.join(__dirname,fileName);
    fs.readFile(filePath, (error, data) => {
        if (error) {
            console.error(error);
        }
        response.end(data);
    });
}