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

//function to generate id for new user and then save to db
async function createUser(firstName, lastName) {
    let id;
    let highestIdUser = await User.find().select('id').sort({ 'id': -1 }).limit(1).exec();

    try {
        id = highestIdUser[0].id + 1;
    } catch (err) {
        id = 0;
    }

    return new User({
        id: id,
        firstName: firstName,
        lastName: lastName
    }).save();
}

module.exports = {
    getUsers: () => User.find(),
    getUser: (id) => User.findOne({ 'id': id }),
    addUser: (firstName, lastName) => createUser(firstName, lastName)
}