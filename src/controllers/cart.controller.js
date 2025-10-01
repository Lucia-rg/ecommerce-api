class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    getCartById = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartService.getCartById(cartId);

            if(!cart) {
                return res.status(404).json({
                message: "Carrito no encontrado."
                });  
            }

            res.json(cart);
            
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });    
        }
    }

    addProductToCart = async (req, res) => {
        try {
            const productId = req.params.pid;
            const cartId = req.params.cid;

            const updatedCart = await this.cartService.addProductToCart(cartId, productId);

            res.json(updatedCart);
            
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });  
        }
    }

    deleteProductFromCart = async (req, res) => {
        try {
            const productId = req.params.pid;
            const cartId = req.params.cid;

            const updatedCart = await this.cartService.deleteProductFromCart(cartId, productId);

            res.json(updatedCart);
            
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });   
        }
    }

    updateCartProducts = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productsArray = req.body.products;

            const updatedCart = await this.cartService.updateCartProducts(cartId, productsArray);

            res.json(updatedCart);
      
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            }); 
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const productId = req.params.pid;
            const cartId = req.params.cid;
            const {quantity} = req.body;

            const updatedCart = await this.cartService.updateProductQuantity(cartId, productId, quantity);

            res.json(updatedCart);

        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });  
        }
    }

    clearCart = async (req, res) => {
        try {
            const cartId = req.params.cid;

            const updatedCart = await this.cartService.clearCart(cartId);

            res.json(updatedCart);
 
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });            
        }
    }

}

module.exports = CartController;