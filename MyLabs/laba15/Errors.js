function write_error_400(res, error) {
    res.statusCode = 400;
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: error}));
}

module.exports = {write_error_400};