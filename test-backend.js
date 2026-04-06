const app = require('./backend/server.js');
const request = require('supertest'); 

async function test() {
  try {
    const res = await request(app).get('/api/products');
    console.log('Status:', res.status);
    console.log('Body:', res.body);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
