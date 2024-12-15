import express from 'express';
import bcrypt from 'bcryptjs';
import UserController from '../models/UserController.js';
import User from '../models/User.js';
import Owner from '../models/Owner.js';
import { generateToken } from '../middleware/authMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, role, email, password, confirmPassword } = req.body;

  // Validation checks
  if (!firstName || !lastName || !role || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  // Check if user already exists
  if (UserController.getUserByEmail(email)) {
    return res.status(400).json({ error: "User already exists with this email." });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user based on role
    let newUser;
    switch(role) {
      case "Renter":
        newUser = new User(firstName, lastName, email, hashedPassword);
        UserController.addUser(newUser);
        break;
      case "Owner":
        newUser = new Owner(firstName, lastName, email, hashedPassword);
        UserController.addOwner(newUser);
        break;
      default:
        return res.status(400).json({ error: "Invalid role selected." });
    }

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = UserController.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: "User does not exist." });
  }

  try {
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password." });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return token and role-based redirect
    return res.status(200).json({ 
      token, 
      message: "Login successful", 
      role: user.role === 'User' ? 'Renter' : user.role 
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed." });
  }
});

router.get('/current-user', authenticateToken, (req, res) => {
  try {
    // The authenticateToken middleware decodes the token and sets req.user
    const currentUser = UserController.getUserByEmail(req.user.email);
    
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user info, excluding sensitive data like password
    const { firstName, lastName, email, role } = currentUser;
    
    res.json({ 
      firstName, 
      lastName, 
      email, 
      role 
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Unable to fetch user information' });
  }
});

export default router;