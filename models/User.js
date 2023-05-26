const mongoose = require('mongoose');

const { Schema } = mongoose; //same with const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, defalut: 0}
});

mongoose.model('users',userSchema);