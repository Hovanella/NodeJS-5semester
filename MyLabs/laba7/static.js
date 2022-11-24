const fs = require('fs');

class StaticHandler {

    MIME = {
        css: "text/css",
        docx: "application/msword",
        png: "image/png",
        js: "application/javascript",
        json: "application/json",
        mp4: "video/mp4",
        xml: "application/xml",
        html: "text/html",
        mp3: "audio/mpeg",
    }


    getHeaderOfStaticByUrl(extension) {
        return {'Content-Type': this.MIME[extension]};
    }


    constructor(folderPath = './static') {
        this.STATIC_FOLDER = folderPath;
    }

    pathStatic(url) {
        return `${this.STATIC_FOLDER}${url}`;
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

exports.StaticHandler = StaticHandler;


























