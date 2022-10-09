const http = require('http');
const db = require('./DB');
const fs = require('fs');
const url = require("url");
const statistic = require("./Statistic");
const readline = require("readline");
const stream = readline.createInterface({
    input : process.stdin
})
const PORT = 3000;

let sd_timer = null;
let sc_timer = null;
let ss_timer = null;

const server = http.createServer().listen(PORT, () => console.log('Start server at http://localhost:3000'));

server.on('request', (req, res) => {

    if (statistic.ssEnabled)
        statistic.requestsCount++;

    console.log(req.url);
    const pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/api/db':
            console.log(req.method);
            db.emit(req.method, req, res);
            break;
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            fs.readFile("./05-01.html", (err, data) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                res.end(data);
            });
            break;
        case '/api/ss':
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(statistic));
            break;
        default:
            res.statusCode = 404;
            res.end("404 Not found");
            break;
    }
});


stream.on("line",(line)=>{
    let x = 0;
    let chunkArray = line.trim().split(' ');
    switch (chunkArray[0]) {
        case 'sd':

            if (sd_timer) {
                console.log('shut down server timer was cleared');
                clearTimeout(sd_timer);
                sd_timer = null;
            }

            x = parseInt(chunkArray[1]);

            if (isNaN(x) === false && x > 0) {

                console.log(`server will be closed after ${x} s`);

                sd_timer = setTimeout(() => {
                    stream.close();
                    server.close(() => {
                        console.log('server is closed');
                    });
                }, x * 1000);
            }
            break;
        case 'sc':

            if (sc_timer != null) {
                console.log('database state fixation >>> disabled');
                clearInterval(sc_timer);
                sc_timer = null;
            }

            x = parseInt(chunkArray[1]);

            if (isNaN(x) === false && x > 0) {
                console.log(`DataBase state fixation >>> enabled, every ${x} s`);

                sc_timer = setInterval(() => {
                    db.emit('COMMIT');
                }, x * 1000);
                sc_timer.unref();
            }

            break;
        case 'ss':

            x = parseInt(chunkArray[1]);

            if (isNaN(x) === false && x > 0) {
                if (ss_timer == null) {
                    statistic.reset();

                    statistic.startDate = (new Date()).toISOString().split('T')[0] + ' ' + (new Date()).toISOString().split('T')[1].split('.')[0];

                    console.log(`Statistic writing >>> enabled for ${x} s`);
                    statistic.ssEnabled = true;

                    ss_timer = setTimeout(() => {
                        console.log('Statistic writing >>> disabled');
                        clearTimeout(ss_timer);
                        statistic.finishDate = (new Date()).toISOString().split('T')[0] + ' ' + (new Date()).toISOString().split('T')[1].split('.')[0];
                        statistic.ssEnabled = false;
                        ss_timer = null;
                    }, x * 1000);
                    ss_timer.unref();
                }
            } else {
                console.log('Statistic writing >>> disabled');
                clearTimeout(ss_timer);
                statistic.finishDate = (new Date()).toISOString().split('T')[0] + ' ' + (new Date()).toISOString().split('T')[1].split('.')[0];
                statistic.ssEnabled = false;
                ss_timer = null;
            }
            break;
        default:
            break;
    }
})


db.on('GET', (req, res) => {
    db.select()
        .then(data => res.end(JSON.stringify(data)));

});


db.on('COMMIT', () => {
        if (statistic.ssEnabled)
            statistic.commitsCount++;
        console.log('COMMITTED');
    }
);

db.on('POST', (req, res) => {
    const user = {};

    req.on('data', chunk => {
        Object.assign(user, JSON.parse(chunk));
    });

    req.on('end', () => {
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

    const user = {};

    req.on('data', chunk => {
        Object.assign(user, JSON.parse(chunk));
    });

    req.on('data', () => {

        db.update(user)
            .then((user) => {
                res.statusCode = 200;
                return res.end(JSON.stringify(user));
            })
            .catch((errorMessage) => {
                res.statusCode = 400;
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
            res.statusCode = 400;
            res.end(errorMessage);
        });
});











