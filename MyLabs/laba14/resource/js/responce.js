
const write202 = (res, data) => {
    res.statusCode = 202;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

const write404 = (res, error) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(error));
}

module.exports = {write202,write404};