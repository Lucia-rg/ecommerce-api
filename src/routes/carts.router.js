const express = require('express');
const router = express.Router();

const CartManager = require('../managers/carts-manager');
const path = require('path');

 const cartManager = new CartManager(path.join(__dirname, '../data/carts.json'))

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });   
    }   
})

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({
                message: "Carrito no encontrado."
            });   
        }
        res.json(cart);

    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });       
    }
    
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        if(!cartId || !productId) {
            return res.status(400).json({
                success: false,
                error: 'Se requieren cart ID y product ID válidos'
            });
        }

        const productInCart = await cartManager.addProductToCart(cartId, productId);
        res.json(productInCart);
        
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });         
    }
    
})

module.exports = router;