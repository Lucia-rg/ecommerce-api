const express = require('express');
const router = express.Router();
const path = require('path');

const ProductManager = require('../managers/product-manager');

const productManager = new ProductManager(path.join(__dirname, '../data/products.json'))

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);   
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });    
    }
} );

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado."
            });   
        }
        res.json(product);   
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });    
    }
}  )

router.post('/', async (req, res) => {
    try {
        console.log('📨 Body recibido:', req.body); 
        const {title, description, code, price, status, stock, category, thumbnails} = req.body;

        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            res.status(400).json({
                success: false,
                error: "Faltan campos obligatorios: title, description, code, price, status, stock, category y thumbnails"
            })   
        }

        const newProduct = await productManager.addProduct({
            title: title.trim(),
            description: description.trim(),
            code: code.trim(),
            price: Number(price),
            status: status !== undefined ? Boolean(status): true,
            stock: Number(stock),
            category: category.trim(),
            thumbnails: thumbnails.trim()
        })
        res.status(201).json(newProduct);
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });   
    }
    
})

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;

        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });    
    }

})

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        const deletedProduct = await productManager.deleteProduct(productId);
        res.json(deletedProduct);
        
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });      
    }

})

module.exports = router;