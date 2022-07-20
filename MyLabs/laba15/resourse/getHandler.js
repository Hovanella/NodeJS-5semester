const url = require('url');

module.exports = (req, res, Db) => {
    let path = url.parse(req.url).pathname;

    switch(path)
    {
        case '/api/faculties':
            Db.GetRecordsByTableName('faculty').then(records => res.end(JSON.stringify(records)))
            .catch(error => {
                write_error_400(res, error);
            });
        break;
        case '/api/pulpits':
            Db.GetRecordsByTableName('pulpit').then(records => res.end(JSON.stringify(records)))
            .catch(error => {
                write_error_400(res, error);
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