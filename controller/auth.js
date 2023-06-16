const asyncHandler = require('express-async-handler')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db_conn');
const { google } = require('googleapis');
const { InviteURL } = require('../util/config');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};
const secretKey = generateSecretKey();

const login = (req, res) => {
  const { name, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE name = ? OR email = ?',
    [name, name],
    async (err, result) => {
      if (result.length === 0) {
        res.json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const user = result[0];
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        res.json({
          success: false,
          error: 'Incorrect password'
        });
        return;
      }

      const accessToken = jwt.sign(
        { userId: user.id },
        secretKey,
        { expiresIn: '1d' }
      );
      res.json({ accessToken, user });
    }
  )
};

const gLogin = async (req, res) => {
  const { access_token } = req.body;
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token });

  const oauth2 = google.oauth2({ version: 'v2', auth: client });
  const { data } = await oauth2.userinfo.get();
  const { id, email, name, picture } = data;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query,
    [email],
    async (error, results) => {
      console.log(results)
      if (results.length > 0) {
        res.json({ success: true });
        return;
      } else {
        res.json({
          success: false,
          error: "User not found"
        })
      }
    })
};

const register = async (req, res) => {
  const { password, name, email, affiliate } = req.body;
  const aff_link = InviteURL + "/" + name;
  const salt = await bcrypt.genSalt(10);
  const hpwd = await bcrypt.hash(password, salt);

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (error, results) => {
    if (results.length > 0) {
      return res.json({
        success: false,
        error: 'Email Already Exist'
      });
    }
    const query1 = 'SELECT * FROM users WHERE name = ?';
    db.query(query1, [name], async (error, results) => {
      if (results.length > 0) {
        return res.json({
          success: false,
          error: 'name Already Exist'
        });
      }
      const query2 = "SELECT * FROM users WHERE name = ?";
      db.query(query2, [affiliate], async (error, results) => {
        const super_aff = results.length > 0 ? results[0].affiliate : "";
        const query3 = "SELECT * FROM users WHERE name = ?";
        db.query(query3, [super_aff], async (error, results) => {
          const sub_aff = results.length > 0 ? results[0].affiliate : "";
          const query4 = 'INSERT INTO users (name, email, password, aff_link, affiliate, super_aff, sub_aff ) VALUES (?, ?, ?, ?, ?, ?, ?)';
          db.query(query4, [name, email, hpwd, aff_link, affiliate, super_aff, sub_aff], async () => {
            const newUser = {
              name,
              email,
              password: hpwd
            };
            const accessToken = jwt.sign(
              { user: newUser },
              secretKey,
              { expiresIn: '1h' }
            );
            res.json({
              success: true,
              accessToken: accessToken
            });
          });
        })
      })
    })
  });
}

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.json({ message: 'Login Session Expired' });
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decode) => {
    if (err) return res.json({ message: err });
    const getUserQuery = 'SELECT * FROM users WHERE name = ?';
    db.query(getUserQuery, [decode.user.name], async (error, results) => {
      const user = results[0];
      if (!user) return res.json({ message: 'Unauthorized' });
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
      res.json(accessToken);
    });
  }));
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

module.exports = { login, gLogin, logout, refresh, register };