const sql = require('mssql/msnodesqlv8');
const config = {
    pool: {
        max: 10,
        min: 0,
    },
    database: 'UNIVER',
    server: 'localhost',
    driver: "msnodesqlv8",
    options: {trustedConnection: true, trustServerCertificate: true}
};

const getDbPool = async () => {
    const pool = new sql.ConnectionPool(config);
    return pool.connect();
};


module.exports = getDbPool;
