// controllers/product.controller.js
const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // 👉 Tạo inventory tương ứng
        await Inventory.create({
            product: product._id
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};