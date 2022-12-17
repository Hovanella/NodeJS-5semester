const url = require('url');
const {write_error_400: Write400, write_error_400} = require("../Errors");
const path = require("path");
const {getInstance} = require("../Connection");

const endpoints = [
    "/api/faculties",
    "/api/pulpits",
    "/transaction"
];

module.exports = async (req, res, instance, client) => {

    const {pathname} = url.parse(req.url);

    let jsonData = '';


    if (endpoints.includes(pathname)) {

        req.on('data', (data) => {
            jsonData += data;
        });

        const postFaculty = async (data) => {

            const collectionName = 'faculty';

            const recordWithSameFaculty = await instance.collection('faculty').findOne({faculty: data.faculty});

            if (recordWithSameFaculty) {
                Write400(res, 'Faculty with this name already exists');
                return false;
            }

            const response = await instance.collection(collectionName).insertOne(data);

            const insertedRecord = await instance.collection(collectionName).findOne({_id: response.insertedId});

            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(insertedRecord));
        };
        const postPulpit = async (data) => {

            const collectionName = 'pulpit';

            if (!await validatePulpit(data))
                return false;

            const response = await instance.collection(collectionName).insertOne(data);

            const insertedRecord = await instance.collection(collectionName).findOne({_id: response.insertedId});

            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(insertedRecord));

        };

        const validatePulpit = async (data) => {

            const recordWithSamePulpit = await instance.collection('pulpit').findOne({pulpit: data.pulpit});

            if (recordWithSamePulpit) {
                Write400(res, 'Pulpit with this pulpit code already exists');
                return false;
            }

            const recordWithSameFaculty = await instance.collection('faculty').findOne({
                faculty: data.faculty
            });

            console.log(data.faculty);

            if (!recordWithSameFaculty) {
                Write400(res, 'Faculty with this name does not exist');
                return false;
            }

            return true;
        };

        const postTransaction = async (data) => {

                const transactionOptions = {
                    readConcern: {level: "local"},
                    writeConcern: {w: "majority"}
                };

                const session = client.startSession();
                session.startTransaction(transactionOptions);

                for (const item of data) {

                    if (!await validatePulpit(item)) {
                        await session.abortTransaction();
                        return;
                    }

                    await instance.collection("pulpit").insertOne(item, {session});

                }
                session.commitTransaction();

                session.endSession();

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({status: "OK"}));
            }
        ;

        req.on('end', async () => {

                const data = JSON.parse(jsonData);

                switch (pathname) {
                    case '/api/faculties':
                        await postFaculty(data);
                        break;
                    case '/api/pulpits':
                        await postPulpit(data);
                        break;
                    case '/transaction':
                        await postTransaction(data);
                        break;
                }

            }
        );
    }

}
;