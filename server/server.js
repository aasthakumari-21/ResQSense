require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resqsense';
console.log(`Attempting to connect to MongoDB at: ${MONGO_URI}`);

mongoose.connect(MONGO_URI)
  .then(async () => {
      console.log('Successfully connected to MongoDB.');
      // Auto-seed required dummy data if database is fresh
      await seedDatabase();
  })
  .catch(err => {
      console.error('MongoDB connection error. Please ensure MongoDB is running locally or specify a valid MONGO_URI string.', err);
      // We will not exit process to allow API failures to gracefully hit frontend rather than crash
  });

// Main API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('ResQSense API is running.');
});

// Export app or listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
