const mongoose = require('mongoose');
const seedData = require('./data');
const Listing = require('../models/listing');

// Database connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/HomeStay';
mongoose.connect(MONGO_URL)
    .then(() => console.log('Database is connected'))
    .catch((e) => console.log('Error', e))

// seeding the dummy data into database
const seedDB = async () => {
    await Listing.deleteMany({});
    seedData.data = seedData.data.map((obj) => ({...obj, owner: '6943c7a6a5d9a1e05c79e883'}));
    await Listing.insertMany(seedData.data);
    console.log("Data was seeded !!");
}

seedDB()
.then(() => {
    mongoose.connection.close();
})
