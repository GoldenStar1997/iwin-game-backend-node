const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();

// const key = fs.readFileSync(__dirname + '/tutorial.key', 'utf-8');
// const cert = fs.readFileSync(__dirname + '/tutorial.crt', 'utf-8');

const port = 8483;
// const parameters = {
//   key: key,
//   cert: cert
// };

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
// const adminRoute = require('./routes/admin');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.use('/auth', authRoute);
app.use('/user', userRoute);
// app.use('/admin', adminRoute);

// Serve the index.html file for any requests that don't match a static file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});