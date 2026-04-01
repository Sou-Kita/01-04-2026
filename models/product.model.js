const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);