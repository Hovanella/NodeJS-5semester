const fs = require('fs');


class StaticHandler {

    MIME = {
        '/css/style.css': 'text/css',
        '/docx/my.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '/image/korgi.png': 'image/png',
        '/js/javascript.js': 'application/javascript',
        '/json/my.json': 'application/json',
        '/video/short.mp4': 'video/mp4',
        '/xml/my.xml': 'application/xml',
        '/html/index.html': 'text/html'
    }

    getHeaderOfStaticByUrl(url) {
        return {'Content-Type': this.MIME[url]};
    }


    constructor(folderPath = './static') {
        this.STATIC_FOLDER = folderPath;
    }

    pathStatic(fn) {
        return `${this.STATIC_FOLDER}${fn}`;
    }

    pipeFile(req, res, headers) {
        res.writeHead(200, headers);
        fs.createReadStream(this.pathStatic(req.url)).pipe(res);
    }

    sendFile(req, res, header) {
        fs.access(this.pathStatic(req.url), fs.constants.R_OK, err => {
            if (err) {
                this.writeHTTP404(req, res)
            } else {
                this.pipeFile(req, res, header)
            }
        })
    }

    writeHTTP404(req, res) {
        const statusCode = 404;
        res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`{"error":"${req.method}: ${req.url}, HTTP status ${statusCode} }"`)
    }


}

//export {StaticHandler}
exports.StaticHandler = StaticHandler;
