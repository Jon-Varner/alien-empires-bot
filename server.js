const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const games = require('./routes/api/games');

const app = express();

/* Message parsing middleware */
app.use(express.json({ extended: false }));

/* Connect to the database */
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

/* Use routes */
app.use('/api/users', users);
app.use('/api/games', games);

/* Switch ports according to dev or prod environment */
const port = process.env.PORT || 5000;

/* Serve static assets in production */
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
