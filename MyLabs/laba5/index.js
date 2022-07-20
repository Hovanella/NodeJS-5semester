const http = require('http');
const db = require('./DB');
const fs = require('fs');
const url = require("url");
const statistic = require("./Statistic");
const PORT = 3000;

let sd_timer = null;
let sc_timer = null;
let ss_timer = null;

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
        case '/api/ss':

            if (statistic.ssEnabled)
                server.emit('requestCounting');

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(statistic));
            break;
        default:
            res.statusCode = 404;
            res.end("404 Not found");
            break;
    }
});

server.on('requestCounting', () => statistic.requestsCount += 1);

server.on('commitCounting', () => statistic.commitsCount += 1);


process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) !== null) {
        let x = 0;
        let chunkArray = chunk.trim().split(' ');

        switch (chunkArray[0]) {
            case 'sd':

                if (sd_timer != null) {
                    console.log('shut down server timer was cleared');
                    clearTimeout(sd_timer);
                    sd_timer = null;
                }

                x = parseInt(chunkArray[1]);

                if (isNaN(x) === false && x > 0) {

                    console.log(`server will be closed after ${x} s`);

                    sd_timer = setTimeout(() => {
                        console.log('server is closed');
                        server.close();
                        process.exit();
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
                        console.log('committed');
                        if (statistic.ssEnabled)
                            server.emit('commitCounting')
                    }, x * 1000);
                    sc_timer.unref();
                }
                break;
            case 'ss':

                x = parseInt(chunkArray[1]);

                if (isNaN(x) === false && x > 0) {
                    if (ss_timer == null) {
                        statistic.reset();
                        statistic.startDate = (new Date()).toISOString().split('T')[0];

                        console.log(`Statistic writing >>> enabled for ${x} s`);

                        ss_timer = setTimeout(() => {
                            console.log('Statistic writing >>> enabled');
                            clearTimeout(ss_timer);
                            statistic.finishDate = (new Date()).toISOString().split('T')[0];
                            statistic.ssEnabled = true;
                            ss_timer = null;
                        }, x * 1000);
                        ss_timer.unref();
                    }
                } else {
                    console.log('Statistic writing >>> disabled');
                    clearTimeout(ss_timer);
                    statistic.finishDate = (new Date()).toISOString().split('T')[0];
                    statistic.ssEnabled = false;
                    ss_timer = null;
                }
                break;
            default:
                break;
        }
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








