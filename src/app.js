const express = require("express");
const mongoose = require("mongoose");
const app = express(); 
const { create } = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require('path');

// Configuraciones
const appConfig = require("./config/app.config");
const databaseConfig = require("./config/database.config");

// Servicio socket

const ProductDAO = require('./dao/mongo/ProductDAO');
const ProductService = require('./services/product.service');

const productDao = new ProductDAO();
const productService = new ProductService(productDao);

const server = http.createServer(app);
const io = new Server(server);

// Conexión MongoDB
mongoose.connect(databaseConfig.MONGODB_URI, {
    ...databaseConfig.mongooseOptions,
    dbName: databaseConfig.DB_NAME
})
.then(() => {
    console.log('Conectado a MongoDB: ', databaseConfig.DB_NAME);
})
.catch((error) => {
    console.error('Error al conectarse a MongoDB: ', error.message);
    process.exit(1);

});

// Configuración handlebars 
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "views/layouts/"),
    partialsDir: path.join(__dirname, "views/partials/"),
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
        neq: function (a, b) {
            return a !== b;
        },
        gt: function (a, b) {
        return a > b;
        },
        multiply: function (a, b) {
        return a * b;
        },
        calculateSubtotal: function (products) {
            return products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        }
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '../public')));

// Routers
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


// Configuración Socket.io
 io.on("connection", (socket) => {
    console.log('Usuario conectado: ', socket.id);

    productService.getProducts({})
    .then(result => {
        socket.emit("productUpdated", result.payload);
    })
    .catch(error => {
        console.error("Error enviando productos iniciales:", error);
    });

    socket.on("createProduct", async(productData) => {
        try {

            const newProduct = await productService.addProduct({
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: Number(productData.price),
                status: productData.status !== undefined ? productData.status : true,
                stock: Number(productData.stock),
                category: productData.category,
                thumbnails: productData.thumbnails

            });

            const updatedProducts = await productService.getProducts({});
            io.emit("productUpdated", updatedProducts.payload);
            
            console.log("✅ Producto creado exitosamente:", newProduct.id);

        } catch (error) {
            console.error("Error creando producto:", error.message);
            socket.emit("error", error.message);  
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {

            await productService.deleteProduct(productId);

            const updatedProducts = await productService.getProducts({});
            io.emit("productUpdated", updatedProducts.payload);
            
            console.log("✅ Producto eliminado exitosamente:", productId);
            
        } catch (error) {
            console.error("Error eliminando producto:", error.message);
            socket.emit("error", error.message);       
        }

    });

    socket.on("requestProducts", async() => {
        try {
            const products = await productService.getProducts({});
            socket.emit("productUpdated", products.payload);
            
        } catch (error) {
            console.error("Error obteniendo productos:", error.message);
            socket.emit("error", error.message);   
        }
    });

    socket.on("disconnect", () => {
        console.log('Usuario desconectado: ', socket.id);
    });

 })

// Ruta raíz. Información de la API

app.get('/', (req, res) => {
    res.redirect('/products');
});

app.get('/api', (req, res) => {
    res.json({
        message: 'E-commerce API de Onda Sonar',
        database: `MongoDB: ${databaseConfig.DB_NAME}`,
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
                'POST /api/carts/:cid/product/:pid': 'Agregar producto al carrito',
                'DELETE /api/carts/:cid/products/:pid': 'Eliminar producto del carrito',
                'PUT /api/carts/:cid': 'Actualizar todos los productos del carrito',
                'PUT /api/carts/:cid/products/:pid': 'Actualizar cantidad de producto',
                'DELETE /api/carts/:cid': 'Vaciar carrito'
            },
            views: {
                'GET /home': 'Vista home con productos',
                'GET /realtimeproducts': 'Vista de productos en tiempo real'
            },
            websockets: {
                'createProduct': 'Crear nuevo producto',
                'deleteProduct': 'Eliminar producto',
                'requestProducts': 'Solicitar lista de productos',
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
        suggestion: 'Visita /api para ver los endpoints disponibles'
    })
})

module.exports = { app, io, server };