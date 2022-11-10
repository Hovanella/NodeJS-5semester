const http = require('http');
const xmlBuilder = require('xmlbuilder');

const xmlElement = xmlBuilder.create("request").att("id", 33)
xmlElement.ele("x").att("value", 1);
xmlElement.ele("x").att("value", 2);
xmlElement.ele("x").att("value", 3);
xmlElement.ele("x").att("value", 4);
xmlElement.ele("m").att("value", "a");
xmlElement.ele("m").att("value", "b");
xmlElement.ele("m").att("value", "c");
const stringXml = xmlElement.end({ pretty: true })


const options = {
    host: 'localhost',
    path: '/task5',
    port: 3000,
    method: 'POST',
    headers: { 'content-type':'text/xml', 'accept':'text/xml' }
};

const req = http.request(options, res => {
    console.log('http.request: statusCode: ', res.statusCode);

    res.on('data', (data) => {
        console.log('body:', data.toString());
    });
}).end(stringXml);


req.on('error', (e) => {
    console.error(e);
});