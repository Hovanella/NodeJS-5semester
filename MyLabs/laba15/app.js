const http = require('http');
const DB = require('./resourse/db');
const Db = new DB();

const getHandler = require('./resourse/getHandler');
const postHandler = require('./resourse/postHandler');
const putHandler = require('./resourse/putHandler');
const deleteHandler = require('./resourse/deleteHandler');


http.createServer((req, res) => {
    switch(req.method) {
        case 'GET': getHandler(req, res, Db); break;
        case 'POST': postHandler(req, res, Db); break;
        case 'PUT': putHandler(req, res, Db); break;
        case 'DELETE': deleteHandler(req, res, Db); break;
    }
}).listen(5000);