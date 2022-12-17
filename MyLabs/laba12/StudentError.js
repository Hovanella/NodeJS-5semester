class StudentError extends Error {
    constructor(error, message) {
        super(message);
        this.name = 'StudentPointError';
        this.error = error;
    }
}

module.exports = {StudentPointError: StudentError};