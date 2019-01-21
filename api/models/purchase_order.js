const mongoose = require('mongoose');
const purchaseOrderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    products: [{ type: mongoose.Schema.Types.ObjectId , required: true, ref: "Product" }]
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
