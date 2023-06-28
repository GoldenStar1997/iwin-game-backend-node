const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db_conn');

const getAffShare = (req, res) => {
  const query = "SELECT * FROM aff_revenue";
  db.query(query, (error, results) => {
    if (error) throw error;
    res.json({
      success: true,
      data: results
    });
  });
};

const setAffShare = (req, res) => {
  const {
    aff_shr, sup_shr, sub_shr
  } = req.body;

  const query = "UPDATE aff_revenue SET aff_shr = ?, sup_shr = ?, sub_shr = ? WHERE id = 1";
  db.query(query, [aff_shr, sup_shr, sub_shr], (error, results) => {
    if (error) throw error;

    res.json({
      success: true,
    })
  })
}

const getUsers = (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (error, results) => {
    if (error) throw error;
    res.json({
      success: true,
      data: results
    })
  })
}

const getGames = (req, res) => {
  const query = 'SELECT * FROM games';

  db.query(query, (error, results) => {
    if (error) throw error;
    res.json({
      success: true,
      data: results
    })
  })
}

const getTours = (req, res) => {
  const query = 'SELECT * FROM tours';

  db.query(query, (error, results) => {
    if (error) throw error;
    res.json({
      success: true,
      data: results
    })
  })
}

module.exports = { getAffShare, setAffShare, getUsers, getGames, getTours }