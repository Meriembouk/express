const express = require('express');
const router = express.Router();
const pool = require('../database/config'); // Utilisez pool au lieu de client pour correspondre à la variable exportée

router.post('/register-bebe', (req, res) => {
    const { nom, prenom, sexe,
         dateDeNaissance, poidsALaNaissance, groupeSanguin, allergies, idParent } = req.body;
  
    // Connect to PostgreSQL using the pool
    pool.query('INSERT INTO Bébé (nom, prenom, sexe, date_de_naissance, poids_à_la_naissance, groupe_sanguin, allergies, id_parent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
               [nom, prenom, sexe, dateDeNaissance, poidsALaNaissance, groupeSanguin, allergies, idParent], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).render('error', { message: 'Une erreur est survenue lors de l\'enregistrement du bébé.' });
      }
  
      res.status(201).render('success', { message: 'Bébé enregistré avec succès!' });
    });
  });
  
  // ... (other routes)

module.exports = router;
