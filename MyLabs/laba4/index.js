const http = require('http');
const db = require('./DB');
const fs = require('fs');
const url = require("url");

const PORT = 3000;
http.createServer(
    (request, response) => {
        const pathname = url.parse(request.url).pathname;

        switch (pathname) {
            case '/api/db':
                db.emit(request.method, request, response);
                break;
            case '/':
                fs.readFile("./04-02.html", (err, data) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    response.end(data);
                });
                break;
            default:
                response.statusCode = 404;
                response.end("404 Not found");
                break;
        }
    }
).listen(PORT, () => console.log('Start server at http://localhost:3000'));

db.on('GET', (req, res) => {
    db.select().then(data => res.end(JSON.stringify(data)));
});

db.on('POST', (req, res) => {

    req.on('data', data => {

        const user = JSON.parse(data);

        db.insert(user)
            .then((user) => {
                res.statusCode = 201;
                return res.end(JSON.stringify(user));
            })
            .catch((errorMessage) => {
                res.statusCode = 400;
                return res.end(errorMessage);
            });
    })

});
db.on('PUT', (req, res) => {

    req.on('data', data => {

        const user = JSON.parse(data);

        db.update(user)
            .then((user) => {
                res.statusCode = 200;
                return res.end(JSON.stringify(user));
            })
            .catch((errorMessage) => {
                res.statusCode = 404;
                res.end(errorMessage);
            });
    })

});
db.on('DELETE', (req, res) => {

    const id = +url.parse(req.url, true).query.id;

    db.delete(id)
        .then(deletedUser => {
            res.statusCode = 200;
            return res.end(JSON.stringify(deletedUser));
        })
        .catch((errorMessage) => {
            res.statusCode = 404;
            res.end(errorMessage);
        });
});
//endregion



