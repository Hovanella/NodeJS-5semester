const fs = require('fs');
const qs = require('querystring');
const {serverRPC} = require('./serverRPC.js');
const {StudentPointError} = require('./StudentError');
const pathFileJSON = './StudentList.json';
const regId = RegExp('^\/\\d+$');
const regBackupDate = RegExp('^\/backup\/\\d{8}$');


fs.watch(pathFileJSON, (event, filename) => {
    console.log(event, filename);
    serverRPC.emit('change');
});

async function getRequestData(req) {
    return new Promise((resolve, reject) => {
        let reqData = '';
        req.on('data', chunk => {
            reqData += chunk;
        });
        req.on('end', () => {
            resolve(reqData);
        });
        req.on('error', err => {
            reject(err);
        });
    });
}

async function getStudent(id) {
    const data = await fs.promises.readFile(pathFileJSON);
    const students = JSON.parse(data.toString());
    const student = students.find(s => s.id === id);
    return student;
}

function write405(req, res) {
    res.writeHead(405, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify({
        error: 405,
        message: `Method ${req.method} not allowed`
    }));
}

function getDateFromYYYYDDMM(dateString) {
    //20220512
    const year = dateString.slice(0, 4);
    const day = dateString.slice(4, 6);
    const month = dateString.slice(6);

    return new Date(year, month, day);
}


async function HandleGetMethod(req, res) {
    const url = req.url;

    switch (true) {
        case url === '/':
            const jsonFile = await fs.promises.readFile(pathFileJSON);
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(jsonFile);
            break;
        case regId.test(url):
            const id = +req.url.slice(1);
            const student = await getStudent(id);
            if (student === undefined) {
                res.statusCode = 404;
                throw new StudentPointError(1, `студент с id ${id} не найден`);
            }
            res.end(JSON.stringify(student));
            break;
        case url === '/backup':
            const files = [];
            for (const name of await fs.promises.readdir('./backup')) {
                files.push(name);
            }
            res.end(JSON.stringify(files));
            break;
    }
}

async function postHandler(req, res) {
    const url = req.url;

    async function addNewStudent(reqData, students) {
        const newStudent = JSON.parse(reqData.toString());
        students.forEach(s => {
            if (s.id === newStudent.id) {
                res.statusCode = 400;
                throw new StudentPointError(2, `студент с id ${newStudent.id} уже есть`);
            }
        });
        students.push(newStudent);
        return newStudent;
    }


    switch (url) {
        case '/':
            const reqData = await getRequestData(req);
            const data = await fs.promises.readFile(pathFileJSON);
            const students = JSON.parse(data.toString());

            const newStudent = await addNewStudent(reqData, students);

            await fs.promises.writeFile(pathFileJSON, JSON.stringify(students));
            res.end(JSON.stringify(newStudent));
            break;

        case '/backup':
            const timeNow = new Date();
            const formatName = `./backup/${timeNow.getFullYear()}${('0' + timeNow.getDate()).slice(-2)}${('0' + (timeNow.getMonth() + 1)).slice(-2)}_StudentList.json`;
            fs.createReadStream(pathFileJSON).pipe(fs.createWriteStream(formatName));
            res.end(`Успешно создан бэкап ${formatName}`);
            break;
    }
}

async function deleteHandler(req, res) {
    const url = req.url;

    switch (true) {
        case regId.test(url):

            const data = await fs.promises.readFile(pathFileJSON);
            const students = JSON.parse(data.toString());

            const id = +req.url.slice(1);
            const deletedStudentIndex = students.findIndex(s => s.id === id);
            if (deletedStudentIndex === -1) {
                throw new StudentPointError(2, `студент с id ${id} не найден`);
            }

            const deleteStudent = students.splice(deletedStudentIndex, 1);
            await fs.promises.writeFile(pathFileJSON, JSON.stringify(students));
            res.end(JSON.stringify(deleteStudent));
            break;
        case regBackupDate.test(url):
            const dateString = url.split('/')[2];
            const date = getDateFromYYYYDDMM(dateString);
            for (const name of await fs.promises.readdir('./backup')) {
                const dateFileString = name.split('_')[0];
                const dateFile = getDateFromYYYYDDMM(dateFileString);
                if (date > dateFile) {
                    await fs.promises.unlink(`./backup/${name}`);
                }
            }
            res.end('Успешно удалено');
            break;
    }
}

async function putHandler(req, res) {
    const url = req.url;

    if (url === '/') {
        const reqData = await getRequestData(req);

        const newStudent = JSON.parse(reqData.toString());
        const data = await fs.promises.readFile(pathFileJSON);
        const students = JSON.parse(data.toString());

        let replaceIndexStudent = students.findIndex(s => s.id === newStudent.id);
        if (replaceIndexStudent === -1) {
            throw new StudentPointError(4, `не найдена информация о студенте с id ${newStudent.id}`);
        }
        students[replaceIndexStudent] = newStudent;

        await fs.promises.writeFile(pathFileJSON, JSON.stringify(students));
        res.end(JSON.stringify(newStudent));
    }
}


module.exports = {getHandler: HandleGetMethod, postHandler, deleteHandler, putHandler, write405};