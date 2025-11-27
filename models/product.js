import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    altNames: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: [],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    labelledPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['cream', 'lotion', 'serum', 'mask', 'moisturizer', 'sunscreen', 'sunblock']
    },
    subcategory: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;