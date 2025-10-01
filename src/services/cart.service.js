class CartService {
    constructor(cartDao){
        this.cartDao = cartDao;
    }

    async createCart() {
        return await this.cartDao.createCart();
    }

    async getCartById(cid) {
        if(!cid) throw new Error('ID del carrito requerido');
        return await this.cartDao.getCartById(cid);
    }

    async addProductToCart(cid, pid) {
        if(!cid || !pid) throw new Error('Se requiere Cart ID y Product ID válidos.');
        return await this.cartDao.addProductToCart(cid, pid);
    }

    async deleteProductFromCart(cid, pid) {
        if(!cid || !pid) throw new Error('Se requiere Cart ID y Product ID válidos.');
        return await this.cartDao.deleteProductFromCart(cid, pid);
    }

    async updateCartProducts(cid, productsArray) {
        if(!cid) throw new Error('ID del carrito requerido');

        if (!Array.isArray(productsArray)){
            throw new Error('El parámetro products debe ser un array.');
        }

        for (const item of productsArray) {
            if (!item.product || !item.quantity) {
                 throw new Error('Cada objeto en el array de products debe tener "product" y "quantity".');
            }

            if (typeof item !== 'object' || item === null) {
            throw new Error('Cada producto debe ser un objeto.');
            }

            if (typeof item.quantity !== 'number' || item.quantity < 1) {
            throw new Error('La cantidad debe ser un número mayor a 0.');
            }

        }

        return await this.cartDao.updateCartProducts(cid, productsArray);
    }

    async updateProductQuantity(cid, pid, quantity) {
        if(!cid || !pid) throw new Error('Se requiere Cart ID y Product ID válidos.');

        if (!quantity || quantity < 1){
            throw new Error('La cantidad del producto debe ser al menos 1.');
        }

        return await this.cartDao.updateProductQuantity(cid, pid, quantity);
    }

    async clearCart(cid) {
        if(!cid) throw new Error('ID del carrito requerido');
        return await this.cartDao.clearCart(cid);
    }

}

module.exports = CartService;