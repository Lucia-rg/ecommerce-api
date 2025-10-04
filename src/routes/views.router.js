const express = require('express');
const router = express.Router();
const path = require('path');

const ProductDAO = require('../dao/mongo/ProductDAO');
const ProductService = require('../services/product.service');

const productDao = new ProductDAO();
const productService = new ProductService(productDao);

const CartDAO = require('../dao/mongo/CartDAO');
const CartService = require('../services/cart.service');

const cartDao = new CartDAO();
const cartService = new CartService(cartDao);

async function renderProductsView(req, res, basePath = '/products') {
    try {
        const { limit = 10, page = 1, sort, category, status } = req.query;

        let filterQuery = null;
        let activeFilterType = null;
        let activeFilterValue = null;

        if (category && category !== '') {
            filterQuery = category;
            activeFilterType = 'category';
            activeFilterValue = category;
        } else if (status && status !== '') {
            filterQuery = status;
            activeFilterType = 'status';
            activeFilterValue = status;
        }

        const result = await productService.getProducts({ 
            limit: parseInt(limit), 
            page: parseInt(page), 
            sort, 
            query: filterQuery
        });

        const allProducts = await productService.getProducts({ limit: 1000 });
        const uniqueCategories = [... new Set(allProducts.payload.map(p => p.category))].filter(Boolean);
        const categories = uniqueCategories.map(cat => ({ value: cat }));

        const baseQueryParams = [];

        if (activeFilterType === 'category') {
            baseQueryParams.push(`category=${encodeURIComponent(activeFilterValue)}`);
        } else if (activeFilterType === 'status') {
            baseQueryParams.push(`status=${encodeURIComponent(activeFilterValue)}`);
        }

        if (sort) {
            baseQueryParams.push(`sort=${sort}`);
        }
        
        if (parseInt(limit) !== 10) {
            baseQueryParams.push(`limit=${limit}`);
        }

        const baseQueryString = baseQueryParams.length > 0 ? `&${baseQueryParams.join('&')}` : '';

        res.render('products', {
            title: basePath === '/api/products' ? 'Productos - API' : 'Productos',
            products: result.payload,
            pagination: {
                page: result.page,
                totalPages: result.totalPages,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${basePath}?page=${result.prevPage}&limit=${limit}${baseQueryString}` : null,
                nextLink: result.hasNextPage ? `${basePath}?page=${result.nextPage}&limit=${limit}${baseQueryString}` : null
            },
            categories: categories,
            selectedCategory: activeFilterType === 'category' ? activeFilterValue : '',
            selectedStatus: activeFilterType === 'status' ? activeFilterValue : '',
            selectedSort: sort || '',
            activeFilterType: activeFilterType
        });

    } catch (error) {
        console.error('Error cargando productos: ', error);

        res.render('products', {
            title: basePath === '/api/products' ? 'Productos - API' : 'Productos',
            products: [],
            pagination: {},
            categories: [],
            selectedCategory: '',
            selectedStatus: '',
            selectedSort: '',
            activeFilterType: null
        });
    }
}

router.get('/home', async (req, res) => {
    const result = await productService.getProducts({ 
            limit: 6,
            page: 1
        });

        res.render('home', {
            title: 'Inicio - Onda Sonar',
            products: result.payload,
            message: 'Bienvenido a nuestra tienda'
        });
});
router.get('/products', (req, res) => renderProductsView(req, res, '/products'));
router.get('/api/products', (req, res) => renderProductsView(req, res, '/api/products'));
router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts', {
        title: 'Productos en tiempo real'
    });
});
router.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productService.getProductById(productId);

        const normalizedProduct = {
            ...product.toObject(),
            id: product._id.toString()
        };
        
        res.render('productDetail', {
            title: product.title,
            product: normalizedProduct
        });
    } catch (error) {
        
        res.render('productDetail', {
            title: 'Error',
            product: null
        });
    }
});
router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getCartById(cartId);
        
        const normalizedCart = {
            ...cart.toObject(),
            id: cart._id.toString(),
            products: cart.products.map(item => ({
                ...item.toObject(),
                product: {
                    ...item.product.toObject(),
                    id: item.product._id.toString()
                }
            }))
        };
        
        res.render('cartDetail', {
            title: 'Tu Carrito',
            cart: normalizedCart
        });

    } catch (error) {
        console.error('Error cargando carrito:', error);
        res.render('cartDetail', {
            title: 'Error',
            cart: null
        });
    }
});

module.exports = router;