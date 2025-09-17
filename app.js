const express = require("express");
const app = express(); 
const { create } = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require('path');

const ProductManager = require("./src/managers/product-manager");
const CartManager = require("./src/managers/carts-manager");

const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager(path.join(__dirname, '/src/data/products.json'));
const cartManager = new CartManager(path.join(__dirname, "/src/data/carts.json"));

// Configuración handlebars 
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "src/views/layouts/"),
    partialsDir: path.join(__dirname, "src/views/partials/")
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const viewsRouter = require('./src/routes/views.router');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configuración Socket.io
 io.on("connection", (socket) => {
    console.log('Usuario conectado: ', socket.id);

    productManager.getProducts()
    .then(products => {
        socket.emit("productUpdated", products);
    })
    .catch(error => {
        console.error("Error enviando productos iniciales:", error);
    });

    socket.on("createProduct", async(productData) => {
        try {

            const newProduct = await productManager.addProduct({
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: Number(productData.price),
                status: productData.status !== undefined ? productData.status : true,
                stock: Number(productData.stock),
                category: productData.category,
                thumbnails: productData.thumbnails

            });

            const updatedProducts = await productManager.getProducts();
            io.emit("productUpdated", updatedProducts);
            
            console.log("✅ Producto creado exitosamente:", newProduct.id);

            // io.emit("productCreated", newProduct);
            // io.emit("requestProducts");

            // console.log("✅ Producto creado exitosamente:", newProduct.id);

        } catch (error) {
            console.error("Error creando producto:", error.message);
            socket.emit("error", error.message);  
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {

            await productManager.deleteProduct(productId);

            const updatedProducts = await productManager.getProducts();
            io.emit("productUpdated", updatedProducts);
            
            console.log("✅ Producto eliminado exitosamente:", productId);
            
        } catch (error) {
            console.error("Error creando producto:", error.message);
            socket.emit("error", error.message);       
        }

    });

    socket.on("requestProducts", async() => {
        try {
            const products = await productManager.getProducts();
            socket.emit("productUpdated", products);
            
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
    res.redirect('/home');
});

app.get('/api', (req, res) => {
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
            },
            views: {
                'GET /home': 'Vista home con productos',
                'GET /realtimeproducts': 'Vista de productos en tiempo real'
            },
            websockets: {
                'createProduct': 'Crear nuevo producto',
                'deleteProduct': 'Eliminar producto',
                'requestProducts': 'Solicitar lista de productos',
                'addToCart': 'Agregar producto al carrito'
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