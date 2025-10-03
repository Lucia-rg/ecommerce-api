const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio.'],
        trim: true,
        minlength: [3, 'El título debe tener al menos 3 caracteres.'],
        maxlength: [100, 'El título no puede exceder 100 caracteres.']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatorio.'],
        trim: true,
        minlength: [10, 'La descripción debe tener al menos 10 caracteres.'],
        maxlength: [500, 'La descripción no puede exceder 500 caracteres.']
    },
    code: {
        type: String,
        required: [true, 'El código es obligatorio.'],
        unique: true,
        trim: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio.'],
        min: [0, 'El precio no puede ser negativo.']
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio.'],
        min: [0, 'El stock no puede ser negativo.'],
        integer: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true
    },
    thumbnails: {
        type: [String], // Array de URLs
        default: []
    }
});

productSchema.plugin(mongoosePaginate);

productSchema.methods.toJSON = function() {
    const product = this.toObject();
    product.id = product._id.toString();
    delete product._id;                   
    delete product.__v;
    return product;
};

module.exports = mongoose.model('Product', productSchema);

