const express = require('express');
const router = express.Router();

const CartDao = require('../dao/mongo/CartDAO');
const CartService = require('../services/cart.service');
const CartController = require('../controllers/cart.controller');

const cartDao = new CartDao();
const cartService = new CartService(cartDao);
const cartController = new CartController(cartService);

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:pid', cartController.addProductToCart);
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
router.put('/:cid', cartController.updateCartProducts);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid', cartController.clearCart);

module.exports = router;