const http = require('http');
const getHandler = require('./resource/js/getHandler');
const postHandler = require('./resource/js/postHandler');
const putHandler = require('./resource/js/putHandler');
const deleteHandler = require('./resource/js/HandleDeleteRequest');
const getDbPool = require("./resource/js/dbConnection");
const DB = require("./resource/js/db");

http.createServer(async (req, res) => {
    const pool = await getDbPool();
    const DataBaseHandler = new DB(pool);
    switch (req.method) {
        case 'GET':
            await getHandler(req, res, DataBaseHandler);
            break;
        case 'POST':
            postHandler(req, res,DataBaseHandler);
            break;
        case 'PUT':
            putHandler(req, res,DataBaseHandler);
            break;
        case 'DELETE':
            deleteHandler(req, res,DataBaseHandler);
            break;
    }
}).listen(5000);