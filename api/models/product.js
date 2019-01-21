const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    price : {type: Number, required: true},
    name : {type: String, required: true},
    inventory: {type: Number, required: true}
});



module.exports = mongoose.model('Product', productSchema);
