const http = require('http');
const url = require('url');
const query = require('querystring');
const mp=require('multiparty');
const parseString = require('xml2js').parseString;
const {MIME, write200, write405, write404} = require("./myResponse");
const fs = require("fs");
const {generateResultXml} = require("./Operations");
const PORT = 3000;

const server = http.createServer();

server.on('request', (req, res) => {
    switch (req.method) {
        case 'GET':
            getHandler(req, res);
            break;
        case 'POST':
            postHandler(req, res);
            break;
        default:
            write405(req, res);
    }
}).listen(PORT, () => console.log(`Server started http://localhost:${PORT}`));

//region Handlers
function getHandler(req, res) {
    const path = url.parse(req.url, true);

    switch (path.pathname) {
        case '/task1':
            write200(res, 'Task1', MIME.HTML);
            break;
        case '/task2':
            write200(res, `x = ${path.query.x}; y = ${path.query.y}`, MIME.HTML);
            break;
        case '/task8':
            write200(res, fs.readFileSync('nodeJS.png'), MIME.PNG);
            break;
        default:
            write404(req, res);
    }
}
function postHandler(req, res) {
    const path = url.parse(req.url, true);

    switch (path.pathname) {
        case '/task3':
            req.on('data', (data) => {
                const params = query.parse(data.toString());
                write200(res, `x = ${params.x}; y = ${params.y}; s = ${params.s}`, MIME.HTML);
            });
            break;
        case '/task4':
            req.on('data', (data) => {
                const params = JSON.parse(data);
                const responseBody =
                    {
                        __comment: params.__comment,
                        x_plus_y: params.x+ params.y,
                        Concatination_s_o: `${params.s}: ${params.o.surname}, ${params.o.name}`,
                        Lenght_m: params.m.length
                    };
                write200(res, JSON.stringify(responseBody), MIME.JSON);

            });
            break;
        case '/task5':
            req.on('data', (data) => {
                parseString(data, (err, result) => {
                    write200(res, generateResultXml(result), MIME.XML);
                });
            });
            break;
        case '/task6-7':
                let form =new mp.Form({uploadDir: './Server'});
            form.on('field',(name,value)=>
            {
                console.log(name,value);
            });
            form.on('file', (name, file)=>
            {
                console.log(name,file);
           });
            form.on("close", () => {
                res.end("Файл получен");
            });
            form.parse(req);
            break;

        case '/task8':

            break;
        default:
            write404(req, res);
    }
}
//endregion