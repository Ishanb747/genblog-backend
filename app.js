const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require("express");
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const postRoute = require("./routes/post");
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "shhhhhhh";
const cors = require('cors');
const LastRoute = require('./routes/last')
app.use(cors());



// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication routes
app.use('/auth', authRoute);

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.use('/post', verifyToken, postRoute);

app.use('/blog', LastRoute);


app.listen(PORT, () => {
  console.log(`Backend is now available at port ${PORT}`);
});