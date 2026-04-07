const path = require('path');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Normalize origins for comparison by removing trailing slashes
    const normalize = (url) => url.replace(/\/$/, "");
    const allowedOrigins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(normalize) 
      : [];
    
    const normalizedOrigin = normalize(origin);
    const isVercelPreview = normalizedOrigin.endsWith('.vercel.app');
    
    if (allowedOrigins.includes(normalizedOrigin) || isVercelPreview || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// API Routes Router for better management
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/auth'));
apiRouter.use('/products', require('./routes/products'));
apiRouter.use('/orders', require('./routes/order'));

// Mount router with both /api and root paths for maximum flexibility across environments
app.use('/api', apiRouter); 
app.use('/', apiRouter); 

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV,
    frontend: process.env.FRONTEND_URL 
  });
});
// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
