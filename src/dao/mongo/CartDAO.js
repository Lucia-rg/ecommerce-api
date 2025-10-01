const Cart = require("../../models/Carts");
const Product = require("../../models/Product");

class CartDAO {
    constructor(){
    }

    async createCart() {
        try {
            const newCart = new Cart();
            return await newCart.save();
        } catch (error) {
            throw new Error(`Error creando el carrito: ${error.message}.`);  
        }
    }

    async getCartById(cid) {
        try {
            const cart = await Cart.findById(cid).populate('products.product');

            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            return cart;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error obteniendo el carrito: ${error.message}.`);    
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const product = await Product.findById(pid);
            const cart = await Cart.findById(cid);

            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const productIndex = cart.products.findIndex(i => i.product.toString() === pid);

            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({product: pid, quantity: 1});
            }

            return await cart.save();   
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error al agregar producto al carrito: ${error.message}.`);  
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const initialLength = cart.products.length;
            cart.products = cart.products.filter(item => item.product.toString() !== pid);

            if (initialLength === cart.products.length) {
                throw new Error('Producto no encontrado en el carrito.');
            }

            return await cart.save();

        } catch (error) {
             if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error eliminando producto del carrito: ${error.message}.`);      
        }

    }

    async updateCartProducts(cid, productsArray) {
        try {
            const cart = await Cart.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            for (const item of productsArray) {
                const product = await Product.findById(item.product);

                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado en la base de datos.`);
                }

                if (!item.quantity || item.quantity < 1) {
                    throw new Error('La cantidad del producto debe ser al menos 1.');
                }
            }

            cart.products = productsArray;
            return await cart.save();
            
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error actualizando los productos del carrito: ${error.message}.`);  
            
        }

    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Cart.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            const productItem = cart.products.find(item => item.product.toString() === pid);

            if (!productItem) {
                throw new Error(`Producto con ID ${item.product} no se encuentra en el carrito.`);
            }

            if (!quantity || quantity < 1){
                throw new Error('La cantidad del producto debe ser al menos 1.');
            }

            productItem.quantity = quantity;

            return await cart.save();
            
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error actualizando la cantidad del producto en el carrito: ${error.message}.`);  
        }

    }

    async clearCart(cid) {
        try {
            const cart = await Cart.findById(cid);

            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            cart.products = [];

            return await cart.save();

        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error('ID del carrito inválido.');
            }
            throw new Error(`Error al limpiar el carrito: ${error.message}.`);  
        }

    }

}

module.exports = CartDAO;