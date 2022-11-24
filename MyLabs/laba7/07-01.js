const http = require('http');
const {StaticHandler} = require('./static');
const staticHandler = new StaticHandler('./static');
const PORT = 4000;


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
    const extension = url?.split(".")[1]?.trim();

    console.log(url);
    console.log(extension);

    if ( staticHandler.MIME.hasOwnProperty(extension) ){
        const headerOfMime = staticHandler.getHeaderOfStaticByUrl(extension);
        staticHandler.sendFile(req, res, headerOfMime);
    }
    else {
        staticHandler.writeHTTP404(req, res);
    }

};


