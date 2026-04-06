require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

const migrate = async () => {
  try {
    console.log('🚀 Starting Data Migration: Local -> Atlas\n');

    // 1. Connect to Local
    console.log('⏳ Connecting to Local MongoDB...');
    const localConn = await mongoose.createConnection(process.env.MONGODB_LOCAL_URI).asPromise();
    console.log('✅ Connected to Local');

    // 2. Connect to Atlas
    const maskedAtlasUri = process.env.MONGODB_ATLAS_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`⏳ Connecting to MongoDB Atlas: ${maskedAtlasUri}...`);
    const atlasConn = await mongoose.createConnection(process.env.MONGODB_ATLAS_URI).asPromise();
    console.log('✅ Connected to Atlas');

    // 3. Define Models for each connection
    const LocalProduct = localConn.model('Product', Product.schema);
    const AtlasProduct = atlasConn.model('Product', Product.schema);
    const LocalUser = localConn.model('User', User.schema);
    const AtlasUser = atlasConn.model('User', User.schema);

    // 4. Migrate Products
    console.log('\n📦 Migrating Products...');
    const products = await LocalProduct.find({});
    console.log(`Found ${products.length} products locally.`);
    
    if (products.length > 0) {
      await AtlasProduct.deleteMany({}); // Optional: clear target before migration
      await AtlasProduct.insertMany(products);
      console.log('✅ Products Migrated!');
    }

    // 5. Migrate Users
    console.log('\n👤 Migrating Users...');
    const users = await LocalUser.find({});
    console.log(`Found ${users.length} users locally.`);
    
    if (users.length > 0) {
      await AtlasUser.deleteMany({});
      await AtlasUser.insertMany(users);
      console.log('✅ Users Migrated!');
    }

    console.log('\n🎉 Migration Successfully Completed!');
    
    await localConn.close();
    await atlasConn.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration Failed!');
    console.error(`Error Logic: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n🔍 Troubleshooting Check:');
      console.log('1. Ensure your IP address is whitelisted in Atlas Network Access.');
      console.log('2. Ensure the hostname in MONGODB_ATLAS_URI is correct.');
    }
    process.exit(1);
  }
};

migrate();
