import jwt from 'jsonwebtoken'
import { env } from 'process'

const SECRET_KEY = env.JWT_SECRET

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization']?.split(' ')[1]

  const cookieToken = req.headers.cookie?.split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];

  const queryToken = req.query.token;

  const token = 
  (authHeader && authHeader.split(' ')[1]) || 
  cookieToken || 
  queryToken;

  // console.log('Token sources:', {
  //   authHeader: authHeader?.split(' ')[1],
  //   cookieToken,
  //   queryToken
  // });

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// Middleware for role-based access control
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden' })
    }

    next()
  }
}

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      email: user.email, 
      role: user.role 
    }, 
    SECRET_KEY, 
    { expiresIn: '1h' }
  )
}