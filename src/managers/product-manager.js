const fs = require("fs/promises");
const crypto = require("crypto");

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.readFileDone = false;
        this.readFilepPromise = this.readFile();
    }

    async ensureReadFileDone() {
        if(!this.readFileDone) {
            await this.readFilepPromise;
        }
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);  
            this.readFileDone = true;          
        } catch (error) {
            await this.saveFile([]);
            this.readFileDone = true;
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

        await this.ensureReadFileDone();

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
        await this.ensureReadFileDone();
        return JSON.parse(JSON.stringify(this.products));  
    }

    async getProductById(pid) {
        await this.ensureReadFileDone();
        const product =  this.products.find(p => p.id === pid);
        if (!product) {
            throw new Error(`Producto no encontrado.`)
        }

        return product;
    }

    async updateProduct(pid, updatedFields) {
        await this.ensureReadFileDone();
        const index = this.products.findIndex(p => p.id === pid);

        if (index === -1) {
            throw new Error(`Producto no encontrado.`)
        }

        if (updatedFields.id) {
            delete updatedFields.id;
        }

        const updatedProduct = {...this.products[index], ...updatedFields };
        this.products[index] = updatedProduct;

        await this.saveFile(this.products);
        return updatedProduct;
    }

    async deleteProduct(pid) {
        await this.ensureReadFileDone();
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== pid);

        if (this.products.length === initialLength) {
            throw new Error(`Producto no encontrado.`)
        }

        await this.saveFile(this.products);
        return pid;

    }
}

module.exports = ProductManager;