const http = require('http');
const db = require('./DB');
const fs = require('fs');
const url = require("url");
const PORT = 3000;

const server = http.createServer().listen(PORT, () => console.log('Start server at http://localhost:3000'));

server.on('request', (req, res) => {

    console.log(req.url);
    const pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/api/db':
            console.log(req.method);
            db.emit(req.method, req, res);
            break;
        case '/':
            fs.readFile("./05-01.html", (err, data) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                res.end(data);
            });
            break;
        default:
            res.statusCode = 404;
            res.end("404 Not found");
            break;
    }
});


db.on('GET', (req, res) => {
    db.select().then(data => res.end(JSON.stringify(data))).catch(() => res.end('Error'));
});
db.on('POST', (req, res) => {
    req.on('data', data => {
        const user = JSON.parse(data);
        db.insert(user).then(() => res.end(JSON.stringify(user))).catch(() => res.end('Error'));
    })
});
db.on('PUT', (req, res) => {
    req.on('data', data => {
        const user = JSON.parse(data);
        db.update(user)
            .then(() => res.end(JSON.stringify(user)))
            .catch(() => {
                res.end('Error')
            });
    })
});
db.on('DELETE', (req, res) => {
    const id = +url.parse(req.url, true).query.id;

    db.deleteUser(id)
        .then(deletedUser => res.end(JSON.stringify(deletedUser)))
        .catch(() => {
            res.end('Error')
        });
});
//endregion



