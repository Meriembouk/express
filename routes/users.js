const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../database/config');
const isAuth = require('./middleware/isAuth');
const isAdmin = require('./middleware/isAdmin');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
// Test de la connexion à la base de données
db.query('SELECT * FROM users LIMIT 5', (error, results) => {
  if (error) {
      console.error("Erreur lors du test de connexion à la base de données:", error);
  } else {
      console.log("Connexion à la base de données réussie. Résultats du test:", results);
  }
});


// ... (other imports)

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/login', (req, res) => {
  return res.status(400).render('login', {
    message: "Suivre nos actualités et offres promotionnelles avec notre Newsletter" // Adjust message as needed
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  

  if (!email || !password) {
    return res.status(400).render('login', {
      message: "Entrer un email et un mot de passe" // Adjust message as needed
    });
  }

  // Improved database query with prepared statement
  db.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
    
    if (results.length > 0) {
      const user = results.rows[0]; // Use rows property for prepared statements
      console.log(user , "/:::::::::::::::")

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }

        if (match) {
          if (user.role === 0) {
            req.session.admin = { id: user.id, name: user.name, email: user.email };
            console.log(req.session.admin);
            return res.status(200).render('./admin/admin'); // Adjust path as needed
          } else {
            req.session.user = { id: user.id, name: user.name, email: user.email };
            console.log(req.session.user);
            return res.status(200).render('./client'); // Adjust path as needed
          }
        } else {
          return res.status(400).render('login', {
            message: "Mot de passe incorrect" // Adjust message as needed
          });
        }
      });
    } else {
      return res.status(400).render('login', {
        message: "Utilisateur non trouvé" // Adjust message as needed
      });
    }
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});


// ... (other imports)

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Password:", password);

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Insert user data into the database
    db.query(
      'INSERT INTO users ("name", "email", "password") VALUES ($1, $2, $3) RETURNING id',
      [name, email, hash],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Internal Server Error');
        } else {
          const userId = results.rows[0].id; // Get the ID of the new line inserted

          // Improved session handling with error checking
          try {
            // Create a new session if it doesn't exist
            if (!req.session.user) {
              req.session.user = { id: userId, email };
            } else {
              // If session already exists, update user data (optional)
              req.session.user.id = userId; // Update user ID
              req.session.user.email = email; // Update email (optional)

            }
          } catch (error) {
            console.error('Error setting session user:', error);
            // Handle session-related errors (e.g., redirect to login)
            return res.redirect('/login'); // Or handle differently based on your application logic
          }

          return res.redirect('/users/login'); // Redirect to login page
        }
      }
    );
  });
});

  
  
  

// routes/users.js

// ... (other imports)

router.get('/admin', (req, res) => {
  // Check if the user is authenticated as admin
  if (req.session.admin) {
    const user = req.session.admin; // Use req.session.admin instead of req.session.user

    return res.render('./admin/admin', { user }); // Pass the user object to the view
  } else {
    // Redirect to login page or handle unauthorized access
    res.redirect('/login');
  }
});

// ... (other routes)

// Reservation form route
router.get('/reservation-form', isAuth, (req, res) => {
  let citiesArrive;
  let citiesDepart;
  let categories;

  // Fetch data for cities from city_arrive and city_depart tables
  db.query('SELECT id_city_a, attitude_city_a, longitude_city_a, name_city_a FROM city_arrive', (errorArrive, cityResultsArrive) => {
    if (errorArrive) {
      console.error(errorArrive);
      return res.status(500).send('Internal Server Error');
    }
    citiesArrive = cityResultsArrive;

    db.query('SELECT id_city_d, attitude_city_d, longitude_city_d, name_city_d FROM city_depart', (errorDepart, cityResultsDepart) => {
      if (errorDepart) {
        console.error(errorDepart);
        return res.status(500).send('Internal Server Error');
      }
      citiesDepart = cityResultsDepart;

      // Fetch data for categories from the category table
      db.query('SELECT id_category, name_category FROM category', (errorCategory, categoryResults) => {
        if (errorCategory) {
          console.error(errorCategory);
          return res.status(500).send('Internal Server Error');
        }
        categories = categoryResults;

        // Render the reservation form with city and category data
        res.render('reservation-form', { citiesArrive, citiesDepart, categories });
      });
    });
  });
});

// Handle form submission for reservations
router.post('/reserve', (req, res) => {
  // Your reservation logic
});



module.exports = router;
