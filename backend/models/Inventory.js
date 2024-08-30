const Mongoose = require('mongoose');
const InventorySchema = new Mongoose.Schema({
    name : {type : String,unique : true, required :true},
    desc : {type : String,},
    unit : {type : String, required :true},
    hsn : {type : String, required :true},
    category : {type : String, required :true},
    createdAt : {type : Date, default : Date.now()},
});

module.exports = Mongoose.model('Inventory', InventorySchema);