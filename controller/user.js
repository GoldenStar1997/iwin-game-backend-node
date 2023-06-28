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
  let query = "SELECT * FROM users WHERE affiliate = ? OR sup_aff = ? OR sub_aff = ?";
  db.query(query, [name, name, name], async (error, results) => {
    if (error) throw error;
    res.json({ results });
  });
}

const setAdsClks = async (req, res) => {
  let { name } = req.body;
  let query = "SELECT * FROM users WHERE name = ?";
  db.query(query, [name], async (error, results) => {
    if (error) throw error;
    let clickCounts = results[0].clickCounts + 1;
    let query1 = "UPDATE users SET clickCounts = ? WHERE name = ?";
    db.query(query1, [clickCounts, name], async (error, results) => {
      if (error) throw error;
      res.json({ success: true });
    });
  });
};

const getAffShare = async (req, res) => {
  let query = "SELECT * FROM aff_revenue WHERE id = 1";
  db.query(query, async (error, results) => {
    if (error) throw error;
    res.json({
      success: true,
      data: results
    });
  });
}

module.exports = { games, getPlayers, setAdsClks, getAffShare }