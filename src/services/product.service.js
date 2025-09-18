class ProductService {
    constructor(productDao){
        this.productDao = productDao
    }

    async getProducts() {
        return await this.productDao.getProducts();
    }

    async getProductById(pid) {
        if(!pid) throw new Error('ID del producto requerido');

        return await this.productDao.getProductById(pid);
    }

    async addProduct(product) {
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
        const missingFields = requiredFields.filter(field => 
            product[field] === undefined ||
            product[field] === null ||
            product[field] === ''
        );

        if (missingFields.length > 0 ) {
            throw new Error(`Faltan los campos obligatorios: ${missingFields.join(', ')}`);   
        }

        return await this.productDao.addProduct(product);

    }

    async updateProduct(pid, updatedFields) {
        if(!pid) throw new Error('ID del producto requerido');
        const existing = await this.productDao.getProductById(pid);
        if(!existing) throw new Error(`Producto no encontrado.`);

        return await this.productDao.updateProduct(pid, updatedFields);

    }

    async deleteProduct(pid) {
        if(!pid) throw new Error('ID del producto requerido');
        const existing = await this.productDao.getProductById(pid);
        if(!existing) throw new Error(`Producto no encontrado.`);

        return await this.productDao.deleteProduct(pid);

    }

}

module.exports = ProductService;