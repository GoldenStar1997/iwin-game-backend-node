const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db_conn');

const getAffShare = (req, res) => {
  const query = "SELECT * FROM aff_revenue";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.json({ success: true, data: results });
    }
  });
};

const setAffShare = (req, res) => {
  const {
    aff_shr, sup_shr, sub_shr
  } = req.body;

  const query = "UPDATE aff_revenue SET aff_shr = ?, sup_shr = ?, sub_shr = ? WHERE id = 0";
  db.query(query, [
    aff_shr, sup_shr, sub_shr
  ], (error, results) => {
    console.log(results)
  })

  res.json({
    success: true,
  })
}

module.exports = { getAffShare, setAffShare }