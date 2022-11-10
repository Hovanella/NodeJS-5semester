const MIME = {
    HTML: 'text/html',
    CSS: 'text/css',
    JS: 'text/javascript',
    PNG: 'image/png',
    DOCX:'application/msword',
    JSON:'application/json',
    XML: 'application/xml',
    MP4: 'video/mp4'
};
exports.MIME = MIME;

function getHeader(mime) {
    return {'Content-Type': mime};
}
exports.getHeader = getHeader;

exports.write200 = (res, message, mime) => {
    const statusCode = 200;
    res.writeHead(statusCode, getHeader(mime));
    res.end(message);
};
exports.write405 = (req, res) => {
    const statusCode = 405;
    res.writeHead(statusCode, getHeader(MIME.HTML));
    res.end(`Error ${statusCode}<br>Request: ${req.method} ${req.url}`);
};
exports.write404 = (res, url, mime) => {
    const statusCode = 404;
    res.writeHead(statusCode, getHeader(mime));
    res.end(`Error ${statusCode}<br>Url: ${url}`);
}