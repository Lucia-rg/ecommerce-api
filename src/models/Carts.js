const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'La cantidad debe ser al menos 1.'],
                default: 1
            }
        }],
        default: []
    }   
});

cartSchema.methods.toJSON = function() {
    const cart = this.toObject();
    cart.id = cart._id;
    delete cart._id;
    delete cart.__v;
    return cart;
};

module.exports = mongoose.model('Cart', cartSchema);