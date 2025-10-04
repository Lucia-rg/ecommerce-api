const Product = require("../../models/Product");

class ProductDAO {
    constructor(){
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true
            }

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            let filter = {};
            if (query) {
                filter = {
                    $or: [
                        {category: {$regex: query, $options: 'i'}},
                        {status: query === 'available' ? true : query === 'unavailable' ? false : undefined}
                    ].filter(option => {
                        const value = Object.values(option)[0];
                        return value !== undefined && value !== null;
                    })
                }

                if (filter.$or.length === 0) {
                    filter = {};
                }
            };

            const result = await Product.paginate(filter, options);

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? 
                    `?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
                nextLink: result.hasNextPage ? 
                    `?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
            };

        } catch (error) {
            throw new Error(`Error obteniendo productos: ${error.message}`);
        }
    }

    async getProductById(pid) {
        try {
            const product = await Product.findById(pid);
            if (!product) {
                throw new Error('Producto no encontrado.');
            }
            return product;   
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error(`ID de producto inválido.`);
            }
            throw new Error('Error obteniendo el producto: ', error.message);  
        }
    }

    async addProduct(productData) {
        try {
            const codeExist = await Product.findOne({code: productData.code});

            if (codeExist) {
            throw new Error('El código del producto ya existe en la base de datos.');  
            }

            const newProduct = new Product(productData);
            return await newProduct.save();
            
        } catch (error) {
            throw new Error('Error creando producto: ', error.message);
        }
    }

    async updateProduct(pid, updatedFields){
        try {

            if (updatedFields.id || updatedFields._id) {
                throw new Error('No se puede actualizar el ID del producto.');
            }

            const updatedProduct = Product.findByIdAndUpdate(pid, updatedFields, {new: true, runValidators: true});

            if (!updatedProduct) {
                throw new Error(`Producto no encontrado.`)
            }

            return updatedProduct;
            
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error(`ID de producto inválido.`);
            }
            throw new Error('Error actualizando el producto: ', error.message);     
        }
    }

    async deleteProduct(pid) {
        try {
            const product =  await Product.findByIdAndDelete(pid);

            if (!product) {
                throw new Error('Producto no encontrado.');
            }

            return pid;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new Error(`ID de producto inválido.`);
            }
            throw new Error('Error eliminando el producto: ', error.message);    
        }  
    }

}

module.exports = ProductDAO;