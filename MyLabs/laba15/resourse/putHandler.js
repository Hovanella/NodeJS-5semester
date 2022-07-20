const url = require('url');

module.exports = (req, res, Db) => {
    let data_json = '';
    switch (url.parse(req.url).pathname) {
        case '/api/faculties':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.UpdateRecords('faculty', data_json._id, data_json).
                then(records => res.end(JSON.stringify(records))).catch(error => {write_error_400(res, error)});
            });
            break;
        case '/api/pulpits':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, {'Content-Type': 'application/json'});
                Db.IsFacultyExist(data_json.faculty).then(result=>{
                    if(result){
                        Db.UpdateRecords('pulpit', data_json._id, data_json).
                        then(records => res.end(JSON.stringify(records))).catch(error => {write_error_400(res, error)});
                    }
               else{
                   write_error_400(res, 'No such faculty');
               }});
           });
            break;
    }
}
function write_error_400(res, error) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid method';
    let htmlText = '<h1>Error 400</h1> </br> <h3>' + error + '</h3>';
    res.end(htmlText);
}