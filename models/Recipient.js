const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
    email: String,
    responded: { type: Boolean, default: false }
});

mongoose.model('recipients', recipientSchema)											 
module.exports = recipientSchema;