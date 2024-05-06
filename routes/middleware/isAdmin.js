// Import any dependencies needed for authentication and authorization
// For example, you may need to import modules for handling user authentication or authorization
const express = require('express');
const session = require('express-session');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../../database/config');



// Define your isAuth middleware function
function isAdmin(req, res, next) {
    // Check if user is authenticated
    if (req.session && req.session.admin && req.session.admin.id) {
      // User is authenticated, call next() to proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to login page or return an appropriate response
      res.redirect('/login'); // Replace with your desired login page URL
    }
  }
  
  // Export the isAuth middleware function
  module.exports = isAdmin;
  