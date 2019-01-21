const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    token: mongoose.Schema.Types.String,
    products: [{ type: mongoose.Schema.Types.ObjectId , required: false, ref: "Product" }]
});

module.exports = mongoose.model('Cart', cartSchema);
