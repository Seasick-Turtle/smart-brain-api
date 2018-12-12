const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : process.env.PG_PASSWORD,
    database : 'smart_brain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// / --> res = this is working
app.get('/', (req, res) => {
  res.send(database.users);
});

// /register --> PUT = user
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// /signin --> POST = success/fail
app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt)});

// /profile/:userID --> GET = user
app.get('/profile/:id', (req, res) => { profile.getProfile(req, res, db)});


// /image --> PUT --> user
app.put('/image', (req, res) => { image.getImageCount(req, res, db)});

app.listen(3000);


