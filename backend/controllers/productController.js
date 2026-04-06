const mongoose = require('mongoose');
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const state = mongoose.connection.readyState;
  if (state !== 1 && state !== 2) {
    console.log(`⚠️ API Request rejected while DB in state: ${state}`);
    return res.status(503).json({ message: `Service temporarily unavailable. DB state: ${state}` });
  }

  try {
    const products = await Product.find({}).maxTimeMS(5000);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, category, image, countInStock } = req.body;
  const product = new Product({
    name,
    price,
    description,
    category,
    image,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

module.exports = { getProducts, getProductById, createProduct };
