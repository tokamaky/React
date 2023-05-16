const mongoose = require('mongoose');

const { Schema } = mongoose; //same with const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: String,
    name: String
});

mongoose.model('users',userSchema);