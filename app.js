import express from 'express'
import path from 'path'
import { env } from 'process'
import { initializeData } from './models/Initializer.js'
import ListingController from './models/ListingController.js';
import UserController from './models/UserController.js';
import User from './models/User.js';
import Owner from './models/Owner.js';
import Listing from './models/Listing.js';



// Initialize the data (demo a database)
initializeData();

const app = express();
const port = env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Serve static files from the 'resources' directory
app.use(express.static(path.join(import.meta.dirname, 'resources')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'general_dashboard.html'));
});

// Serve the rest depending on the path
app.get('/login', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'register.html'));
});
app.get('/owner_dashboard', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'owner_dashboard.html'));
});
app.get('/admin_dashboard', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'admin_dashboard.html'));
});


// API route for fetching all listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = ListingController.getListings();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route for fetching listing details
app.get('/api/listings/:id', async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = ListingController.getListingById(listingId);
    
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ error: 'Listing not found' });
    }
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for registering a new user
app.post("/register", (req, res) => {
  const { firstName, lastName, role, email, password, confirmPassword } = req.body;

  // Validation: Check if all fields are provided
  if (!firstName || !lastName || !role || !email || !password || !confirmPassword) {
    return res.status(400).send("All fields are required.");
  }

  // Validation: Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  // Check if the user already exists
  if (UserController.getUserByEmail(email)) {
    return res.status(400).send("User already exists with this email.");
  }

  // Register the user
  if (role === "Renter") {
    UserController.addUser(new User(firstName, lastName, email, password))

    return res.status(201).send("User registered successfully!");
  } else {
    UserController.addOwner(new Owner(firstName, lastName, email, password))
    return res.status(201).send("Owner registered successfully!");

  }

});

// Route for logging in a user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation: Check if all fields are provided
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  // Check if user exists
  const user = UserController.getUserByEmail(email)
  if (!user) {
    return res.status(400).send("User does not exist.");
  }

  // Validate password
  if (user.password !== password) {
    return res.status(400).send("Invalid password.");
  }

    // Role-based response
    if (user instanceof Owner) {
      return res.status(200).json({ message: "Login successful", role: "Owner" });
    } else if (user instanceof User) {
      return res.status(200).json({ message: "Login successful", role: "Renter" });
    } else if (user instanceof Admin) {
      return res.status(200).json({ message: "Login successful", role: "Admin" });
    } else {
      return res.status(400).send("User role not recognized.");
    }

});

app.post("/api/create-post", (req, res) => {


  const { title, price, description } = req.body
  ListingController.addListing(new Listing(title, price, description))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});