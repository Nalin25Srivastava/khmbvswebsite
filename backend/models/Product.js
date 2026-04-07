const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  flavors: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
    }
  ],
  quantities: [
    { 
      size: { type: String, required: true }, 
      price: { type: Number, required: true } 
    }
  ],
}, {
  timestamps: true,
});

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ name: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
