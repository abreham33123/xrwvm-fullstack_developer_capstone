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

// MongoDB connection with improved settings
mongoose.connect("mongodb://mongo_db:27017/dealershipsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initialize database with better error handling
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

// API Documentation Endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Dealerships API",
    endpoints: {
      allDealers: {
        path: "/fetchDealers",
        method: "GET",
        description: "Get all dealerships"
      },
      dealersByState: {
        path: "/fetchDealers/:state",
        method: "GET",
        description: "Get dealerships by state (supports partial matching)",
        example: "/fetchDealers/California or /fetchDealers/CA"
      },
      dealerById: {
        path: "/fetchDealer/:id",
        method: "GET",
        description: "Get a specific dealership by ID"
      },
      allReviews: {
        path: "/fetchReviews",
        method: "GET",
        description: "Get all reviews"
      },
      reviewsByDealer: {
        path: "/fetchReviews/dealer/:id",
        method: "GET",
        description: "Get reviews for a specific dealership"
      },
      addReview: {
        path: "/insert_review",
        method: "POST",
        description: "Add a new review"
      }
    }
  });
});

// Get all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find().select('-__v');
    res.json({
      success: true,
      count: dealers.length,
      data: dealers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dealerships',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get dealerships by state with enhanced matching
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const stateInput = req.params.state.trim();
    
    if (!stateInput || stateInput.length < 2) {
      return res.status(400).json({
        success: false,
        message: "State parameter must be at least 2 characters"
      });
    }

    const sanitizedInput = escapeRegExp(stateInput);
    let dealers;

    // Try exact match first (case sensitive)
    dealers = await Dealerships.find({ state: sanitizedInput }).select('-__v');
    
    // If no results, try case-insensitive exact match
    if (dealers.length === 0) {
      dealers = await Dealerships.find({ 
        state: { $regex: new RegExp(`^${sanitizedInput}$`, 'i') } 
      }).select('-__v');
    }
    
    // If still no results and input is 3+ chars, try partial match
    if (dealers.length === 0 && sanitizedInput.length >= 3) {
      dealers = await Dealerships.find({
        state: { $regex: new RegExp(`^${sanitizedInput}`, 'i') }
      }).select('-__v');
    }

    if (dealers.length === 0) {
      const allStates = await Dealerships.distinct('state');
      return res.status(404).json({
        success: false,
        message: `No dealerships found matching '${stateInput}'`,
        suggestions: allStates.sort(),
        hint: "Try full state names like 'California' or 'Texas'",
        allDealersEndpoint: "/fetchDealers"
      });
    }

    res.json({
      success: true,
      count: dealers.length,
      data: dealers
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Database operation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: req.params.id }).select('-__v');
    
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found',
        suggestion: 'Try /fetchDealers to see all available dealers'
      });
    }
    
    res.json({
      success: true,
      data: dealer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dealer',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});