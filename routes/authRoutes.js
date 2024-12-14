import express from 'express';

import UserController from '../models/UserController.js';
import User from '../models/User.js';
import Owner from '../models/Owner.js';

const router = express.Router();

router.post("/register", (req, res) => {
const { firstName, lastName, role, email, password, confirmPassword } = req.body;

if (!firstName || !lastName || !role || !email || !password || !confirmPassword) {
    return res.status(400).send("All fields are required.");
}

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

router.post("/login", (req, res) => {
const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).send("Email and password are required.");
}

const user = UserController.getUserByEmail(email)
if (!user) {
    return res.status(400).send("User does not exist.");
}

if (user.password !== password) {
    return res.status(400).send("Invalid password.");
}

    // Role-based response
    if (user.role === 'Owner') {
    return res.status(200).json({ message: "Login successful", role: "Owner" });
    } else if (user.role === 'User') {
    return res.status(200).json({ message: "Login successful", role: "Renter" });
    } else if (user.role === 'Admin') {
    return res.status(200).json({ message: "Login successful", role: "Admin" });
    } else {
    return res.status(400).send("User role not recognized.");
    }

});

export default router;