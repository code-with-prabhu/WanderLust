const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport-local-mongoose");


// passport-local-mongoose automatically add two field in the Schema that is the username and the password (salted, hasheds)
const userSchema = Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passport);
module.exports = mongoose.model('User', userSchema);