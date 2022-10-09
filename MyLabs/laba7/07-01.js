const http = require('http');
const {StaticHandler} = require('./static');
const staticHandler = new StaticHandler('./static');
const PORT = 3000;

http.createServer((req, res) => {
    switch(req.method) {
        case 'GET':
            getHandler(req, res);
            break;
        default:
            const statusCode = 405;
            res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`{"error":"${req.method}: ${req.url}, HTTP status ${statusCode}"}`)
            break;
    }
}).listen(PORT, () => console.log(`Start server at http://localhost:3000`));

const getHandler = (req, res) => {

    const url = req.url;

    if ( staticHandler.MIME.hasOwnProperty(url) ){
        const headerOfMime = staticHandler.getHeaderOfStaticByUrl(url);
        staticHandler.sendFile(req, res, headerOfMime);
    }
    else {
        staticHandler.writeHTTP404(req, res);
    }

};


