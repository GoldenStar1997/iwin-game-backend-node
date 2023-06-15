const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db_conn');

const games = async (req, res) => {
  let query = "SELECT * FROM games WHERE status = ?";
  db.query(query, [1], async (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json({
        success: true,
        data: results
      });
    } else {
      res.json({
        success: false,
        error: "No Game Found"
      });
    }
  });
};

const getPlayers = async (req, res) => {
  let { name } = req.body;
  let query = "SELECT * FROM users WHERE invitedBy = ?";
  db.query(query, [ name ], async (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json({
        success: true,
        data: results
      });
    } else {
      res.json({
        success: false,
        error: "Not User Found"
      });
    }
  });
}

module.exports = { games, getPlayers }