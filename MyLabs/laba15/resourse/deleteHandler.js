const url = require('url');
module.exports = (req, res, Db) => {
    let path = decodeURI(url.parse(req.url).pathname);
    let path_params= path.split('/');
    switch ('/api/' + path_params[2]) {
        case '/api/faculties':
            res.writeHead(200, {'Content-Type': 'application/json'});
            console.log(path_params[3]);
            Db.DeleteRecord('faculty','faculty', path_params[3]).then(records => {
                res.end(JSON.stringify(records))
            }).catch(error => {write_error_400(res, error)});
        break;
        case '/api/pulpits':
            res.writeHead(200, {'Content-Type': 'application/json'});
            Db.DeleteRecord('pulpit','pulpit', path_params[3]).then(records => {
                res.end(JSON.stringify(records))
            }).catch(error => {write_error_400(res, error)});
        break;
    }
}
function write_error_400(res, error) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid method';
    let htmlText = '<h1>Error 400</h1> </br> <h3>' + error + '</h3>';
    res.end(htmlText);
}
            