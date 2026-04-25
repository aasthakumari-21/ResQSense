require('dotenv').config();
const mongoose = require('mongoose');
const { Zone, Volunteer, Resource, Alert } = require('./models');
const seedDatabase = require('./seed');

mongoose.connect('mongodb://127.0.0.1:27017/resqsense').then(async () => {
    await Zone.deleteMany({});
    await mongoose.models.Incident.deleteMany({});
    await Volunteer.deleteMany({});
    await Resource.deleteMany({});
    await Alert.deleteMany({});
    console.log('Database wiped! Ready to re-seed with Guwahati data.');
    await seedDatabase();
    process.exit(0);
});
