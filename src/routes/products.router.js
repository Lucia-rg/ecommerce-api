const express = require('express');
const router = express.Router();
const path = require('path');

const ProductDao = require('../dao/product.dao');
const ProductService = require('../services/product.service');
const ProductController = require('../controllers/product.controller');

const productDao = new ProductDao(path.join(__dirname, '../data/products.json'));
const productService = new ProductService(productDao);
const productController = new ProductController(productService);

router.get("/", productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:pid', productController.updatedProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
module.exports.productService = productService;