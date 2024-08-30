const Mongoose = require('mongoose');
const CustomerSchema = new Mongoose.Schema({
    name : {type : String, required :true},
    email : {type : String, required :true, unique : true},
    phone : {type : String, required :true},
    address : {type : String},
    createdAt : {type : Date, default : Date.now()},
});

module.exports = Mongoose.model('Customer', CustomerSchema);