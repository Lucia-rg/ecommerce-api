const express = require('express');
const router = express.Router();
const path = require('path');

const ProductManager = require('../managers/product-manager');
const productManager = new ProductManager(path.join(__dirname, '../data/products.json'))

router.get('/home', async (req, res) => {

    try {
        const products = await productManager.getProducts();
        const categories = [... new Set(products.map(p => p.category))].filter(Boolean);

        res.render('home', {
        title: 'Productos',
        products: products,
        categories: categories
        });

    } catch (error) {
        console.error('Error cargando productos: ', error);

        res.render('home', {
        title: 'Productos',
        products: [],
        categories: []
    });
        
    }
    
});

router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts', {
        title: 'Productos en tiempo real'
    });
});

module.exports = router;