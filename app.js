const express = require("express");
const app = express(); 

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta raíz. Información de la API

app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce API de Onda Sonar',
        endpoints: {
            products: {
                'GET /api/products': 'Listar todos los productos',
                'GET /api/products/:pid': 'Obtener producto por ID',
                'POST /api/products': 'Crear nuevo producto',
                'PUT /api/products/:pid': 'Actualizar producto',
                'DELETE /api/products/:pid': 'Eliminar producto'
            },
            carts: {
                'POST /api/carts': 'Crear nuevo carrito',
                'GET /api/carts/:cid': 'Obtener carrito por ID',
                'POST /api/carts/:cid/product/:pid': 'Agregar producto al carrito'
            }
        },
        documentation: 'Usa Postman para probar los endpoints'
    });
});

// Ruta no encontrada

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Ruta no encontrada: ${req.originalUrl}`,
        suggestion: 'Visita / para ver los endpoints disponibles'
    })
})

module.exports = app;