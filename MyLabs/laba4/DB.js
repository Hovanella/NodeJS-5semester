const events = require('events');

class DB extends events.EventEmitter {
    users = [];

    async select() {
        return this.users;
    }

    async insert(user) {

        if (this.users.find(u => u.id === user.id)) {
            return Promise.reject('User already exists');
        }
        this.users.push(user);
        return user;

    }

    async update(user) {
        const index = this.users.findIndex(u => u.id === user.id);

        if (index !== -1) {
            this.users[index] = user;
            return user;
        }
        return Promise.reject('User not found');

    }

    async delete(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            const deletedUser = this.users.splice(index, 1);
            return Promise.resolve(deletedUser);
        }
        return Promise.reject('User not found');
    }

}

module.exports = new DB();