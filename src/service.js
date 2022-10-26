const mongoose = require('mongoose');
const mongoUrl = process.env.MONGOURL;

let client;
mongoose.connect( mongoUrl );

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
}, {
    versionKey: false
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    getUsers: () => User.find(),
    addUser: params => new User(params).save(),
};