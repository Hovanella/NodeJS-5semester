const url = require('url');
const {write_error_400} = require("../Errors");

const endpoints = [
    "/api/faculties",
    "/api/pulpits"
]

module.exports = async (req, res, instance) => {

    const {pathname} = url.parse(req.url);

    if (endpoints.includes(pathname)) {

        const collection = pathname.split('/')[2];

        let collectionName;
        if (collection === 'faculties')
            collectionName = 'faculty';
        else
            collectionName = 'pulpit';

        const records = await instance.collection(collectionName).find().toArray();

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(records));
    }
    else {
        write_error_400(res, 'Invalid endpoint');
    }

};


