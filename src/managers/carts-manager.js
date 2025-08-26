const fs = require("fs/promises");
const crypto = require("crypto");

class CartManager {
    constructor (filePath) {
        this.path = filePath;
        this.carts = [];
        this.readFile();
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);            
        } catch (error) {
            await this.saveFile([]);
        }
    }

    async saveFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data,null,2), 'utf8');   
        } catch (error) {
            throw new Error(`Error al guardar el archivo: ${error.message}`);  
        }
    }

    #generateId() {
        return crypto.randomUUID();
    }

    async createCart() {
        const newCart = {id: this.#generateId(), products: []};
        this.carts.push(newCart);

        await this.saveFile(this.carts);
        return newCart;
    }

    async getCartById(cid) {
        const cart = this.carts.find(c => c.id === cid);
        if (!cart) {
            throw new Error(`Carrito no encontrado.`)
        }
        return cart;
    }

    async addProductToCart(cid, pid) {
        try {

            const cart = this.getCartById(cid)
            const existingProduct = cart.products.find(p => p.product === pid);

            if (existingProduct) {
                existingProduct.quantity+=1;
            } else {
                cart.products.push({
                    product: pid,
                    quantity: 1
                })
            }

            await this.saveFile(this.carts);
            return cart;
  
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);   
        }
    }

}

module.exports = CartManager;