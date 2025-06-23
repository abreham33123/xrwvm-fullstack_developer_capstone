const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const { escapeRegExp } = require('lodash');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

// Load initial data
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// MongoDB connection
mongoose.connect("mongodb://mongo_db:27017/dealershipsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initialize the database
async function initializeDatabase() {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();

// API Documentation
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Dealerships API",
    endpoints: {
      allDealers: "/fetchDealers",
      dealersByState: "/fetchDealers/:state",
      dealerById: "/fetchDealer/:id",
      allReviews: "/fetchReviews",
      reviewsByDealer: "/fetchReviews/dealer/:id",
      addReview: "/insert_review"
    }
  });
});

// GET all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find().select('-__v');
    res.json({ success: true, count: dealers.length, data: dealers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dealerships', details: error.message });
  }
});

// GET dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateInput = req.params.state.trim();
    if (!stateInput || stateInput.length < 2) {
      return res.status(400).json({ success: false, message: "State parameter must be at least 2 characters" });
    }

    const sanitizedInput = escapeRegExp(stateInput);
    let dealers = await Dealerships.find({ state: sanitizedInput }).select('-__v');

    if (dealers.length === 0) {
      dealers = await Dealerships.find({ state: { $regex: new RegExp(`^${sanitizedInput}$`, 'i') } }).select('-__v');
    }

    if (dealers.length === 0 && sanitizedInput.length >= 3) {
      dealers = await Dealerships.find({ state: { $regex: new RegExp(`^${sanitizedInput}`, 'i') } }).select('-__v');
    }

    if (dealers.length === 0) {
      const allStates = await Dealerships.distinct('state');
      return res.status(404).json({
        success: false,
        message: `No dealerships found matching '${stateInput}'`,
        suggestions: allStates.sort()
      });
    }

    res.json({ success: true, count: dealers.length, data: dealers });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Database operation failed', details: error.message });
  }
});

// GET dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: parseInt(req.params.id) }).select('-__v');
    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }
    res.json({ success: true, data: dealer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dealer', details: error.message });
  }
});

// GET all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const reviews = await Reviews.find().select('-__v');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviews', details: error.message });
  }
});

// GET reviews by dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const reviews = await Reviews.find({ dealership: parseInt(req.params.id) }).select('-__v');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviews for dealer', details: error.message });
  }
});

// POST a new review
app.post('/insert_review', async (req, res) => {
  try {
    const newReview = new Reviews(req.body);
    await newReview.save();
    res.json({ success: true, message: "Review added successfully", data: newReview });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to add review', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
