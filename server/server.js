const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const passport = require('passport');
const GitHubStrategy = require('passport-github2');
require('dotenv').config();

const authRouter = require('./routes/auth.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
