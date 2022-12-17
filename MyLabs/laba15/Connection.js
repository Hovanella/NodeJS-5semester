const {MongoClient} = require("mongodb");
const getInstance = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const instance =  client.db('BSTU');

    return {client,instance};
};

module.exports = {getInstance};

