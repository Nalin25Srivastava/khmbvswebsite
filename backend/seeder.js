require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
  {
    name: 'Premium Dishwash',
    image: '/images/lemon.png',
    description: 'Highly effective dishwashing liquid that removes tough grease and stains effortlessly.',
    brand: 'KHMBVS',
    category: 'Cleaning',
    price: 60,
    countInStock: 20,
    rating: 4.5,
    numReviews: 12,
    flavors: [
      { name: 'Lemon', image: '/images/lemon.png' },
      { name: 'Aloe Vera', image: '/images/aloevera.png' }
    ],
    quantities: [
      { size: '1L', price: 60 },
      { size: '2L', price: 100 }
    ],
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
    quantities: [
      { size: '1L', price: 149 },
      { size: '5L', price: 699 }
    ],
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
    quantities: [
      { size: '250ml', price: 79 },
      { size: '500ml', price: 129 }
    ],
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
    quantities: [
      { size: '500ml', price: 129 },
      { size: '1L', price: 219 }
    ],
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
    quantities: [
      { size: 'Set of 3', price: 199 },
      { size: 'Set of 6', price: 349 }
    ],
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
