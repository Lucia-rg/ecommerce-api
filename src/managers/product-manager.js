const fs = require("fs/promises");
const crypto = require("crypto");

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.readFile();
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);            
        } catch (error) {
            await this.saveFile([]);
        }
    }

    async saveFile(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products,null,2), 'utf8');   
        } catch (error) {
            throw new Error(`Error al guardar el archivo: ${error.message}`);  
        }
    }

    #generateId() {
        return crypto.randomUUID();
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

        const codeExist = this.products.some(p => p.code === product.code);
        if (codeExist) {
            throw new Error(`El código del producto ya existe en la base de datos.`);  
        }

        const newProduct = {id: this.#generateId(), ...product};
        this.products.push(newProduct);

        await this.saveFile(this.products);
        return newProduct;
    }

    async getProducts() {
        return JSON.parse(JSON.stringify(this.products));  
    }

    async getProductById(pid) {
        const product =  this.products.find(p => p.id === pid);
        if (!product) {
            throw new Error(`Producto no encontrado.`)
        }

        return product;
    }

    async updateProduct(pid, updatedFields) {
        const index = this.products.findIndex(p => p.id === pid);

        if (index === -1) {
            throw new Error(`Producto no encontrado.`)
        }

        const updatedProduct = {pid, ...this.products[index], ...updatedFields };
        this.products[index] = updatedProduct;

        await this.saveFile(this.products);
        return updatedProduct;
    }

    async deleteProduct(pid) {
        const filteredBooks = this.products.filter(p => p.id !== pid);

        if (this.products.length === filteredBooks.length) {
            throw new Error(`Producto no encontrado.`)
        }

        await this.saveFile(this.filteredBooks);
        return pid;

    }
}

module.exports = ProductManager;