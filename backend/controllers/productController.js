const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const getProducts = async (req, res) => {
  try {
    // Ensure DB is connected (handles cold starts)
    await connectDB();

    const products = await Product.find({})
      .select('name price image brand rating countInStock')
      .maxTimeMS(5000);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    // Ensure DB is connected (handles cold starts)
    await connectDB();
    
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    // Ensure DB is connected (handles cold starts)
    await connectDB();

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
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
