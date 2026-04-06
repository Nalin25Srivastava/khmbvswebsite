require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
  {
    name: 'Premium Dishwash',
    image: '/images/dishwash.png',
    description: 'Highly effective dishwashing liquid that removes tough grease and stains effortlessly.',
    brand: 'KHMBVS',
    category: 'Cleaning',
    price: 99,
    countInStock: 20,
    rating: 4.5,
    numReviews: 12,
    flavors: [
      { name: 'Lemon', image: '/images/dishwash.png' },
      { name: 'Aloe Vera', image: '/images/aloevera.png' }
    ],
    quantities: ['500ml', '1L', '2L'],
  },
  {
    name: 'Multi-Surface Floor Cleaner',
    image: '/images/floor claner.png',
    description: 'Leave your floors sparkling clean and fresh with this multi-surface floor cleaner.',
    brand: 'KHMBVS',
    category: 'Cleaning',
    price: 149,
    countInStock: 15,
    rating: 4.0,
    numReviews: 8,
    flavors: [],
    quantities: ['1L', '5L'],
  },
  {
    name: 'Gentle Handwash',
    image: '/images/handwash.png',
    description: 'Keep your hands soft and germ-free with our gentle yet effective handwash.',
    brand: 'KHMBVS',
    category: 'Hygiene',
    price: 79,
    countInStock: 25,
    rating: 4.8,
    numReviews: 20,
    flavors: [],
    quantities: ['250ml', '500ml'],
  },
  {
    name: 'Harpic Toilet Cleaner',
    image: '/images/harpic.png',
    description: 'Ultimate cleaning power for your toilet, ensuring hygiene and freshness.',
    brand: 'KHMBVS',
    category: 'Cleaning',
    price: 129,
    countInStock: 10,
    rating: 4.2,
    numReviews: 15,
    flavors: [],
    quantities: ['500ml', '1L'],
  },
  {
    name: 'Natural Fresh Soaps',
    image: '/images/soaps.png',
    description: 'Indulge in a refreshing bath with our range of natural soaps.',
    brand: 'KHMBVS',
    category: 'Hygiene',
    price: 199,
    countInStock: 30,
    rating: 4.7,
    numReviews: 25,
    flavors: [],
    quantities: ['Set of 3', 'Set of 6'],
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
