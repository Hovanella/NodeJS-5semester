const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

class DB {

    GetRecordsByTableName(tableName) {
        return this.instance.collection(tableName).find({}).toArray();
    }

    GetRecord(tableName, fields) {
        return this.instance
            .then(db => {
                return db.collection(tableName).findOne(fields);
            })
            .then(record => {
                if (!record) throw 'No records';
                return record;
            });
    }

    InsertRecords(tableName, tableColumn, code, fields) {
        return this.instance
            .then(async db => {
                let tableCol = JSON.parse('{"' + tableColumn + '": "' + code + '"}');
                console.log(code);
                await db.collection(tableName).findOne(tableCol).then(record => {
                    if (record) throw 'This doc exists';
                    return record;
                });
                db.collection(tableName).insertOne(fields, (err, r) => {
                    if (err) console.log(err);
                    else {
                        console.log(r.insertedCount);
                    }
                });
                return this.GetRecord(tableName, tableCol);
            });
    }

    UpdateRecords(tableName, id, fields) {
        return this.instance
            .then(async db => {
                console.log(id);
                if (!id) {
                    throw "Wrong ID";
                }
                delete fields._id;
                await this.GetRecord(tableName, {_id: ObjectId(id)});
                await db.collection(tableName).updateOne({_id: ObjectId(id)}, {$set: fields});
                return this.GetRecord(tableName, fields);
            })
    }

    IsFacultyExist(code) {
        let tableCol = JSON.parse('{"faculty": "' + code + '"}');
        return this.instance
            .then(db => {
                return db.collection('faculty').findOne(tableCol);
            })
            .then(record => {
                if (!record) return false;
                return true;
            });
    }

    DeleteRecord(tableName, tableColumn, code) {
        return this.instance
            .then(async db => {
                if (!code) {
                    throw 'Wrong faculty';
                }
                console.log("DB delete");
                let tableCol = JSON.parse('{"' + tableColumn + '": "' + code + '"}');
                let removedRecord = await this.GetRecord(tableName, tableCol);
                await db.collection(tableName).deleteOne(tableCol);
                return removedRecord;
            });
    }
}

module.exports = DB;



