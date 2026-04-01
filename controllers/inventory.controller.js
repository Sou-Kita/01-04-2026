const Inventory = require('../models/inventory.model');

// 🔍 Get all (join product)
exports.getAll = async (req, res) => {
    try {
        const data = await Inventory.find().populate('product');
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔍 Get by ID
exports.getById = async (req, res) => {
    try {
        const data = await Inventory.findById(req.params.id)
            .populate('product');

        if (!data) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ➕ Add Stock
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        inventory.stock += quantity;

        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ➖ Remove Stock
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        inventory.stock -= quantity;

        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔒 Reserve (giữ hàng)
exports.reserve = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock to reserve' });
        }

        inventory.stock -= quantity;
        inventory.reserved += quantity;

        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 💰 Sold (bán hàng)
exports.sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;

        const inventory = await Inventory.findOne({ product });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Not enough reserved items' });
        }

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;

        await inventory.save();

        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};