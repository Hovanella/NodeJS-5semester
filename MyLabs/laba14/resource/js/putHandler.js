const url = require('url');
const DB = require('./db')
const {write404, write202} = require("./responce");
const endpoints =
    [
        '/api/faculties',
        '/api/pulpits',
        '/api/subjects',
        '/api/auditoriumstypes',
        '/api/auditoriums'
    ]


module.exports = (req, res) => {

    let endpoint = url.parse(req.url).pathname;
    let data_json = '';

    if (endpoints.includes(endpoint)) {

        req.on('data', chunk => {
            data_json += chunk;
        });
        req.on('end', () => {
            data_json = JSON.parse(data_json);
            DB.executeQueryByEndpoint(`PUT: ${endpoint}`, data_json).then(data => {
                write202(res, data.recordset);
            }).catch(err => {
                write404(res, err);
            }).catch(err => console.log('Error: ', err));
        });
        return;
    }
    write404(res, 'Not found');
}

