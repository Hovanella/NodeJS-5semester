const fs = require('fs');

exports.MIME = {
    '/css/style.css': 'text/css',
    '/docx/my.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '/image/korgi.png': 'image/png',
    '/js/javascript.js': 'application/javascript',
    '/json/my.json': 'application/json',
    '/video/short.mp4': 'video/mp4',
    '/xml/my.xml': 'application/xml',
    '/index.html': 'text/html'
}

exports.getHeader = (mime) => {
    return {'Content-Type': mime};
};

exports.stat = (pathStatic) => new Stat(pathStatic);

class Stat {
    constructor(sfn = './static') {
        this.STATIC_FOLDER = sfn;
    }

    #pathStatic(fn) {
        return `${this.STATIC_FOLDER}${fn}`;
    }

    #pipeFile(req, res, headers) {
        res.writeHead(200, headers);
        fs.createReadStream(this.#pathStatic(req.url)).pipe(res);
    }
    sendFile(req, res, headers) {
        fs.access(this.#pathStatic(req.url), fs.constants.R_OK, err => {
            if (err) {
                this.writeHTTP404(req, res)
            } else {
                this.#pipeFile(req, res, headers)
            }
        })
    }

    writeHTTP404(req, res) {
        const statusCode = 404;
        res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`{"error":"${req.method}: ${req.url}, HTTP status ${statusCode} }"`)
    }

    writeHTTP405(req, res) {
        const statusCode = 405;
        res.writeHead(statusCode, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`{"error":"${req.method}: ${req.url}, HTTP status ${statusCode}"}`)
    }
}

