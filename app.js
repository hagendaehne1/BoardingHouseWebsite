import express from 'express'
import path from 'path'
import { env } from 'process'
import { initializeData } from './models/Initializer.js'

import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import { authenticateToken, checkRole } from './middleware/authMiddleware.js';

// Initialize the data (demo a database)
initializeData();

const app = express();
const port = env.PORT || 3000;

app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(express.static(path.join(import.meta.dirname, 'resources')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authRoutes);
app.use(listingRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'general_dashboard.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'register.html'));
});

// Protected routes with role-based access
app.get('/owner_dashboard', authenticateToken, checkRole(['Owner']), (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'owner_dashboard.html'));
});

app.get('/admin_dashboard', authenticateToken, checkRole(['Admin']), (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'admin_dashboard.html'));
});

app.get('/user_dashboard', authenticateToken, checkRole(['User']), (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'user_dashboard.html'));
});

app.get('/compare', (req, res) => {
  res.sendFile(path.join(import.meta.dirname, 'views', 'comparison.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});