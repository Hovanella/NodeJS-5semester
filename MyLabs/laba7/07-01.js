const http = require('http');
const fs = require('fs');
const { stat, MIME, getHeader } = require('./static');
const st = stat('./static');
const PORT = 3000;

const server = http.createServer((req, res) => {
    switch(req.method) {
        case 'GET':
            getHandler(req, res);
            break;
        default:
            st.writeHTTP405(req, res);
    }
}).listen(PORT,
    () => console.log(`Start server at http://localhost:3000`));


const getHandler = (req, res) => {
    const url = req.url;

    if ( MIME.hasOwnProperty(url) ){
        st.sendFile(req, res, getHeader(MIME[url]));
    }
    else {
        st.writeHTTP404(req, res);
    }

};


