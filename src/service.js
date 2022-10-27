const mongoose = require('mongoose');
const mongoUrl = process.env.MONGOURL;

console.log(mongoUrl);
mongoose.connect( mongoUrl );

//user format
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
}, {
    //no v__ field
    versionKey: false
});

const User = mongoose.model('User', UserSchema);

//Function to perform prechecks on _id validity before performing User.findOne()
function findOneUser(id) {
    if(mongoose.Types.ObjectId.isValid(id)) {
        return User.findById(id);
    } else {
        return null;
    }
};

module.exports = {
    getUsers: () => User.find(),
    getUser: id => findOneUser(id),
    addUser: params => new User(params).save()
};