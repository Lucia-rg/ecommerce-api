class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.productService.getProducts();
            res.json(products); 
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });   
        }
    }

    getProductById = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await this.productService.getProductById(productId);

            if (!product) {
                return res.status(404).json({
                    message: "Producto no encontrado."
                });   
            }
            res.json(product); 
            
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });   
        }
    }

    addProduct = async (req, res) => {
        try {

            const {title, description, code, price, status, stock, category, thumbnails} = req.body;

            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
                return res.status(400).json({
                    success: false,
                    error: "Faltan campos obligatorios: title, description, code, price, status, stock, category y thumbnails"
                })   
            }

            const newProduct = await this.productService.addProduct({
                title: title.trim(),
                description: description.trim(),
                code: code.trim(),
                price: Number(price),
                status: status !== undefined ? Boolean(status): true,
                stock: Number(stock),
                category: category.trim(),
                thumbnails: thumbnails.trim()
            })
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });  
            
        }

    }

    updatedProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedFields = req.body;

            const updatedProduct = await this.productService.updateProduct(productId, updatedFields);
            res.json(updatedProduct);
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            }); 
            
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.pid;

            const deletedProduct = await this.productService.deleteProduct(productId);
            res.json(deletedProduct);
            
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });     
        }
    }

}

module.exports = ProductController;