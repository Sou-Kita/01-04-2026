const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/product.controller');

router.post('/', ctrl.createProduct);

module.exports = router;