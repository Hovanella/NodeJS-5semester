const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const xmlbuilder = require('xmlbuilder');
const check = require('./check');
const multiparty = require('multiparty');
const {MIME, write200, write405, write404} = require("./myResponse");
const {sum, generateResult, generateResultXml} = require("./Operations");
const querystring = require('querystring');
const PORT = 3000;

const server = http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            getHandler(req, res);
            break;
        case 'POST':
            postHandler(req, res);
            break;
        default:
            write405(req, res);
            break;
    }
}).listen(PORT, () => console.log(`Start server at http://localhost:3000`));


function getHandler(req, res) {

    const path = url.parse(req.url, true);

    switch (path.pathname) {

        case '/connection': {
            if (path.query?.set) {
                server.keepAliveTimeout = +path.query.set;
                write200(res, `New KeepAliveTimeout is = ${server.keepAliveTimeout}`, MIME.HTML);
            } else {
                write200(res, `Current KeepAliveTimeout = ${server.keepAliveTimeout}`, MIME.HTML);
            }
            break;
        }
        case '/headers': {
            let result = '<h2>Request Headers</h2>';
            Object.keys(req.headers).forEach(key => {
                result += `${key} = ${req.headers[key]}<br>`
            });
            write200(res, result, MIME.HTML);
            break;
        }
        case '/parameter': {

            if (path.query?.x && path.query?.y) {

                const x = +path.query.x,
                    y = +path.query.y;

                if (isNaN(x) || isNaN(y)) {
                    write405(req, res);
                } else {
                    write200(res, generateResult(x, y), MIME.HTML);
                }
            } else {
                write405(req, res);
            }

            break;
        }
        case '/close': {
            const timeBeforeClosingServerInSeconds = 10 * 1000;
            setTimeout(() => {
                server.close();
                process.exit();
            }, timeBeforeClosingServerInSeconds);
            write200(res, `Сервер будет остановлен через ${timeBeforeClosingServerInSeconds} мс`, MIME.HTML);
        }
            break;
        case '/socket':
            write200(res,
                `
                ServerAddress =  ${req.socket.localAddress}<br>
                ServerPort = ${req.socket.localPort}<br>
                ClientAddress = ${req.socket.remoteAddress}<br>
                ClientPort = ${req.socket.remotePort}
                `, MIME.HTML);
            break;
        case '/req-data':
            req.on('data', (data) => {
                console.log('PART');
                res.write(data)
            });
            req.on('end', () => {
                res.end()
            });
            break;
        case '/resp-status':
            const code = path.query.code, mess = path.query.mess;
            if (code && mess) {
                res.statusCode = code;
                res.statusMessage = mess;
            }
            res.end(`code: ${code}; mess: ${mess}`);
            break;
        case '/formparameter':
            fs.createReadStream('./static/index.html').pipe(res);
            break;
        case '/files':
            fs.readdir("./static", (err, files) => {
                res.setHeader("X-static-files-count", files.length);
                res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                res.end(`X-static-files-count: ${files.length}`);
            });
            break;
        case '/files/filename':

            break;
        case '/upload':
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.end(fs.readFileSync("uploadForm.html"));
            break;
        default:
            const parameterPattern = new RegExp('^\\/parameter\\/(.+)\\/(.+)$');
            if (parameterPattern.test(path.pathname)) {
                const arrayPath = path.pathname.slice(1).split('/');
                const x = +arrayPath[1], y = +arrayPath[2];

                write200(res, generateResult(x, y), MIME.HTML);
                break;
            }

            if (path.pathname.slice(1).split("/")[0] === "files") {
                let arrayPath = path.pathname.slice(1).split("/");
                let fileName = arrayPath[1];
                if (fs.existsSync(`./static/${fileName}`)) {
                    fs.access(`./static/${fileName}`, fs.constants.R_OK, () => {
                        res.writeHead(200, {"Content-Type": "application/txt; charset=utf-8"});
                        fs.createReadStream(`./static/${arrayPath[1]}`).pipe(res);
                    });
                } else {
                    write404(res, req.url, MIME.HTML);
                }
                break;
            }

            write404(res, req.url, MIME.HTML);

    }
}

function postHandler(req, res) {
    const path = url.parse(req.url, true);

    switch (path.pathname) {
        case '/formparameter':
            req.on('data', data => {
                const params = querystring.parse(data.toString());
                let body = '';
                Object.keys(params).forEach(key => body += `${key} = ${params[key]}<br>`);
                write200(res, body, MIME.HTML)
            });
            break;
        case '/json':
            req.on('data', data => {
                const params = JSON.parse(data);
                const oBody =
                    {
                        __comment: params.__comment,
                        x_plus_y: sum(params.x, params.y),
                        Concatination_s_o: `${params.s}: ${params.o.surname}, ${params.o.name}`,
                        Lenght_m: params.m.length
                    };
                write200(res, JSON.stringify(oBody), MIME.JSON);
            });
            break;
        case '/xml':
            req.on('data', data => {
                parseString(data, (err, result) => {
                    write200(res, generateResultXml(result), MIME.XML);
                })
            });
            break;
        case '/upload':
            let form = new multiparty.Form({uploadDir: "./static"});
            form.on("field", (name, value) => {

            });
            form.on("file", (name, file) => {
                console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
            });
            form.on("error", (err) => {
                res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                res.end(`${err}`);
            });
            form.on("close", () => {
                res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                res.end("Файл получен");
            });
            form.parse(req);
            break;
        default:

    }

}




