const db = require('../db_conn');


// get affiliate share

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

// set affiliate share

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

// get User list

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

// get game list

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

// get tour list

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

// add new game

const addNewGame = (req, res) => {
  const { path } = req.file;
  const { name, alias } = req.body;
  const curTime = new Date().toLocaleDateString();
  const query = 'INSERT INTO games (name, alias, path, updated_at, status ) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [name, alias, path, curTime, 0], (error, results) => {
    if (error) throw error;
    res.json({
      success: true,
    })
  })

}

module.exports = { getAffShare, setAffShare, getUsers, getGames, getTours, addNewGame }