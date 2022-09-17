const events = require('events');

class DB extends events.EventEmitter {
    users = [];

    select() {
        return new Promise((resolve, reject) => resolve(this.users));
    }

    insert(user) {
        return new Promise((resolve, reject) => {
            if (this.users.find(u => u.id === user.id) !== undefined)
                reject("User already exists");
            else {
                this.users.push(user);
                resolve('Success');
            }
        });
    }

    update(user) {
        return new Promise((resolve, reject) => {
            const index = this.users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                this.users[index] = user;
                resolve('Success');
            } else {
                reject('User not found');
            }
        });
    }

    deleteUser(id) {
        return new Promise((resolve, reject) => {
            const index = this.users.findIndex(u => u.id === id);
            console.log(this.users);
            console.log(index);
            if (index !== -1) {
                this.users.splice(index, 1);
                resolve(deletedUser);
            } else {
                reject();
            }
        });
    }
}

module.exports = new DB();


