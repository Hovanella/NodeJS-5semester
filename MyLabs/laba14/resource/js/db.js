const sql = require('mssql/msnodesqlv8');
const config = {
    database: 'UNIVER',
    server: 'localhost',
    driver: "msnodesqlv8",
    options: {trustedConnection: true, trustServerCertificate: true}
};


class DB {
    constructor() {
        this.connectionPool = new sql.ConnectionPool(config).connect().then(async pool => {
            console.log('Connected to MSSQL server');
            return pool;
        }).catch(err => console.log('Connection failed: ', err));

    }

    executeQueryByEndpoint(endpointWithMethod, data) {
        switch (endpointWithMethod) {

            case 'GET: /api/faculties':
                return this.getFaculties();
            case 'GET: /api/pulpits':
                return this.getPulpits();
            case 'GET: /api/subjects':
                return this.getSubjects();
            case 'GET: /api/auditoriumstypes':
                return this.getAuditoriumsTypes();
            case 'GET: /api/auditoriums':
                return this.getAuditoriums();

            case 'POST: /api/faculties':
                return this.postFaculties(data);
            case 'POST: /api/pulpits':
                return this.postPulpits(data);
            case 'POST: /api/subjects':
                return this.postSubjects(data);
            case 'POST: /api/auditoriumstypes':
                return this.postAuditoriumsTypes(data);
            case 'POST: /api/auditoriums':
                return this.postAuditoriums(data);

            case 'PUT: /api/faculties':
                return this.putFaculties(data);
            case 'PUT: /api/pulpits':
                return this.putPulpits(data);
            case 'PUT: /api/subjects':
                return this.putSubjects(data);
            case 'PUT: /api/auditoriumstypes':
                return this.putAuditoriumsTypes(data);
            case 'PUT: /api/auditoriums':
                return this.putAuditoriums(data);

            case 'DELETE: /api/faculties':
                return this.deleteFaculties(data);
            case 'DELETE: /api/pulpits':
                return this.deletePulpits(data);
            case 'DELETE: /api/subjects':
                return this.deleteSubjects(data);
            case 'DELETE: /api/auditoriumstypes':
                return this.deleteAuditoriumsTypes(data);
            case 'DELETE: /api/auditoriums':
                return this.deleteAuditoriums(data);


            default:
                return Promise.reject('Not found');


        }
    }


    getFaculties() {
        return this.connectionPool.then(pool => {
            return pool.request().query('SELECT * FROM FACULTY');
        }).catch(err => console.log('Error: ', err));
    }

    getPulpits() {
        return this.connectionPool.then(pool => {
            return pool.request().query('SELECT * FROM PULPIT');
        }).catch(err => console.log('Error: ', err));
    }

    getSubjects() {
        return this.connectionPool.then(pool => {
            return pool.request().query('SELECT * FROM SUBJECT');
        }).catch(err => console.log('Error: ', err));
    }

    getAuditoriumsTypes() {
        return this.connectionPool.then(pool => {
            return pool.request().query('SELECT * FROM AUDITORIUM_TYPE');
        }).catch(err => console.log('Error: ', err));
    }

    getAuditoriums() {
        return this.connectionPool.then(pool => {
            return pool.request().query('SELECT * FROM AUDITORIUM');
        }).catch(err => console.log('Error: ', err));
    }

    postFaculties(data) {
        const faculty = data.faculty;
        const facultyName = data.facultyName;

        return this.connectionPool.then(pool => {
            return pool.request().input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, facultyName)
                .query('INSERT FACULTY(FACULTY, FACULTY_NAME) values(@faculty , @faculty_name)');
        })
    }

    postPulpits(data) {
        const pulpit = data.pulpit;
        const pulpitName = data.pulpitName;
        const faculty = data.faculty;

        return this.connectionPool.then(pool => {
            return pool.request().input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpitName)
                .input('faculty', sql.NVarChar, faculty)
                .query('INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) VALUES(@pulpit, @pulpit_name, @faculty)');
        })
    }

    postSubjects(data) {
        const subject = data.subject;
        const subjectName = data.subjectName;
        const pulpit = data.pulpit;

        return this.connectionPool.then(pool => {
            return pool.request().input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subjectName)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) VALUES(@subject, @subject_name, @pulpit)');
        });
    }


    postAuditoriums(data) {
        const auditorium = data.auditorium;
        const auditoriumName = data.auditoriumName;
        const auditoriumType = data.auditoriumType;
        const auditoriumCapacity = +data.auditoriumCapacity;

        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditoriumName)
                .input('auditorium_type', sql.NVarChar, auditoriumType)
                .input('auditorium_capacity', sql.Int, auditoriumCapacity)
                .query('INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY) VALUES(@auditorium, @auditorium_name, @auditorium_type, @auditorium_capacity)');
        });
    }

    postAuditoriumsTypes(data) {
        const auditoriumType = data.auditoriumType;
        const auditoriumTypeName = data.auditoriumTypeName;

        return this.connectionPool.then(pool => {
            return pool.request().input('auditorium_type', sql.NVarChar, auditoriumType)
                .input('auditorium_type_name', sql.NVarChar, auditoriumTypeName)
                .query('INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) VALUES(@auditorium_type, @auditorium_type_name)');
        });
    }

    putFaculties(data) {
        const faculty = data.faculty;
        const facultyName = data.facultyName;

        return this.connectionPool.then(pool => {
            return pool.request().input('faculty', sql.NVarChar, faculty)
                .input('faculty_name', sql.NVarChar, facultyName)
                .query('UPDATE FACULTY SET FACULTY_NAME = @faculty_name WHERE FACULTY = @faculty');
        }).catch(err => console.log('Error: ', err));
    }

    putPulpits(data) {
        const pulpit = data.pulpit;
        const pulpitName = data.pulpitName;
        const faculty = data.faculty;

        return this.connectionPool.then(pool => {
            return pool.request().input('pulpit', sql.NVarChar, pulpit)
                .input('pulpit_name', sql.NVarChar, pulpitName)
                .input('faculty', sql.NVarChar, faculty)
                .query('UPDATE PULPIT SET PULPIT_NAME = @pulpit_name, FACULTY = @faculty WHERE PULPIT = @pulpit');
        }).catch(err => console.log('Error: ', err));
    }

    putSubjects(data) {
        const subject = data.subject;
        const subjectName = data.subjectName;
        const pulpit = data.pulpit;

        return this.connectionPool.then(pool => {
            return pool.request().input('subject', sql.NVarChar, subject)
                .input('subject_name', sql.NVarChar, subjectName)
                .input('pulpit', sql.NVarChar, pulpit)
                .query('UPDATE SUBJECT SET SUBJECT_NAME = @subject_name, PULPIT = @pulpit WHERE SUBJECT = @subject');
        }).catch(err => console.log('Error: ', err));
    }

    putAuditoriums(data) {
        const auditorium = data.auditorium;
        const auditoriumName = data.auditoriumName;
        const auditoriumType = data.auditoriumType;
        const auditoriumCapacity = +data.auditoriumCapacity;

        return this.connectionPool.then(pool => {
            return pool.request()
                .input('auditorium', sql.NVarChar, auditorium)
                .input('auditorium_name', sql.NVarChar, auditoriumName)
                .input('auditorium_type', sql.NVarChar, auditoriumType)
                .input('auditorium_capacity', sql.Int, auditoriumCapacity)
                .query('UPDATE AUDITORIUM SET AUDITORIUM_NAME = @auditorium_name, AUDITORIUM_TYPE = @auditorium_type, AUDITORIUM_CAPACITY = @auditorium_capacity WHERE AUDITORIUM = @auditorium');
        }).catch(err => console.log('Error: ', err));
    }

    putAuditoriumsTypes(data) {
        const auditoriumType = data.auditoriumType;
        const auditoriumTypeName = data.auditoriumTypeName;

        return this.connectionPool.then(pool => {
            return pool.request().input('auditorium_type', sql.NVarChar, auditoriumType)
                .input('auditorium_type_name', sql.NVarChar, auditoriumTypeName)
                .query('UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditorium_type_name WHERE AUDITORIUM_TYPE = @auditorium_type');
        }).catch(err => console.log('Error: ', err));
    }


    deleteFaculties(code) {
        const faculty = code;

        return this.connectionPool.then(pool => {
            return pool.request().input('faculty', sql.NVarChar, faculty)
                .query('DELETE FROM FACULTY WHERE FACULTY = @faculty');
        }).catch(err => console.log('Error: ', err));
    }

    deletePulpits(code) {
        const pulpit = code;
        return this.connectionPool.then(pool => {
            return pool.request().input('pulpit', sql.NVarChar, pulpit)
                .query('DELETE FROM PULPIT WHERE PULPIT = @pulpit');
        }).catch(err => console.log('Error: ', err));
    }

    deleteSubjects(code) {
        const subject = code;

        return this.connectionPool.then(pool => {
            return pool.request().input('subject', sql.NVarChar, subject)
                .query('DELETE FROM SUBJECT WHERE SUBJECT = @subject');
        }).catch(err => console.log('Error: ', err));
    }

    deleteAuditoriums(code) {
        const auditorium = code;

        return this.connectionPool.then(pool => {
            return pool.request().input('auditorium', sql.NVarChar, auditorium)
                .query('DELETE FROM AUDITORIUM WHERE AUDITORIUM = @auditorium');
        }).catch(err => console.log('Error: ', err));
    }

    deleteAuditoriumsTypes(code) {
        const auditoriumType = code;

        return this.connectionPool.then(pool => {
            return pool.request().input('auditorium_type', sql.NVarChar, auditoriumType)
                .query('DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditorium_type');
        }).catch(err => console.log('Error: ', err));
    }

}

module.exports = new DB();


