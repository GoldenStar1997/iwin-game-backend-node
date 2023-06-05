const asyncHandler = require('express-async-handler')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db_conn');
const { google } = require('googleapis');

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
      if (err) {
        res.json({
          success: false,
          error: 'Internal Server Error'
        });
        return;
      }
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
      // Generate access token with expiration for one day
      const accessToken = jwt.sign(
        { userId: user.id },
        secretKey,
        { expiresIn: '1d' }
      );
      res.json({ accessToken });
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
  const { password, name, email } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (error, results) => {
    if (results.length > 0) {
      return res.json({ message: 'Email Already Exist' });
    }
    // Check if name already exists
    const query1 = 'SELECT * FROM users WHERE name = ?';
    db.query(query1, [name], async (error, results) => {
      if (results.length > 0) {
        return res.json({ message: 'name Already Exist' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const query2 = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(query2, [name, email, hashPassword], async (error, results) => {
        const newUser = {
          name,
          email,
          password: hashPassword
        };

        const accessToken = jwt.sign({ user: newUser }, "ACCESS_TOKEN_SECRET", { expiresIn: '1h' });
        const refreshToken = jwt.sign({ user: newUser }, "REFRESH_TOKEN_SECRET", { expiresIn: '1h' });

        res.cookie('jwt', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'None',
          maxAge: 24 * 60 * 60 * 1000
        });

        res.json(accessToken);
      });
    });
  });
}

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.json({ message: 'Login Session Expired' });
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decode) => {
    if (err) return res.json({ message: err });
    console.log(decode.user.name);
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