const http = require('http');
const getHandler = require('./resource/js/getHandler');
const postHandler = require('./resource/js/postHandler');
const putHandler = require('./resource/js/putHandler');
const deleteHandler = require('./resource/js/deleteHandler');

http.createServer((req, res) => {
    switch(req.method) {
        case 'GET': getHandler(req, res); break;
        case 'POST': postHandler(req, res); break;
        case 'PUT': putHandler(req, res); break;
        case 'DELETE': deleteHandler(req, res); break;
    }
}).listen(5000);