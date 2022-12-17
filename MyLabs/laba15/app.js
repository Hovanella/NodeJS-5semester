const http = require('http');
const DB = require('./resourse/db');

const getHandler = require('./resourse/getHandler');
const postHandler = require('./resourse/postHandler');
const putHandler = require('./resourse/putHandler');
const deleteHandler = require('./resourse/deleteHandler');
const {getInstance} = require("./Connection");


http.createServer(async (req, res) => {
    const {instance,client} = await getInstance();
    switch(req.method) {
        case 'GET': await getHandler(req, res, instance); break;
        case 'POST': await postHandler(req, res, instance,client); break;
        case 'PUT': putHandler(req, res, instance); break;
        case 'DELETE': deleteHandler(req, res, instance); break;
    }
}).listen(5000);

