use BSTU

//create collection containing _id , faculty and faculty_name

db.createCollection("faculty", { validator: { $jsonSchema: { bsonType: "object", required: [ "_id", "faculty", "faculty_name" ], properties: { _id: { bsonType: "objectId" }, faculty: { bsonType: "string" }, faculty_name: { bsonType: "string" } } } } } )

//create collection pulpit containing _id , pulpit , pulpit_name and faculty
db.createCollection("pulpit", { validator: { $jsonSchema: { bsonType: "object", required: [ "_id", "pulpit", "pulpit_name", "faculty" ], properties: { _id: { bsonType: "objectId" }, pulpit: { bsonType: "string" }, pulpit_name: { bsonType: "string" }, faculty: { bsonType: "string" } } } } } )

