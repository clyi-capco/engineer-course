const mongoose = require('mongoose');
const mongoUrl = process.env.MONGOURL;

mongoose.connect(mongoUrl);

//user format
const UserSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        index: true 
    },
    firstName: String,
    lastName: String
}, {
    //no v__ field
    versionKey: false
});

const User = mongoose.model('User', UserSchema);

//Function to perform prechecks on _id validity before performing User.findOne()
function findOneUser(id) {
    return User.findOne({ 'id': id });
};

async function createUser(firstName, lastName) {
    let id;
    let highestIdUser = await User.find().select('id').sort({ 'id': -1 }).limit(1).exec();

    id = highestIdUser[0].id + 1;

    return new User({
        id: id,
        firstName: firstName,
        lastName: lastName
    }).save();
}

module.exports = {
    getUsers: () => User.find(),
    getUser: (id) => findOneUser(id),
    addUser: (firstName, lastName) => createUser(firstName, lastName)
}