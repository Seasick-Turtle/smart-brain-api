const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

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



// const to hold temp database objects
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      password: 'cookies',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      password: 'bananas',
      email: 'sally@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ]
};

// / --> res = this is working
app.get('/', (req, res) => {
  res.send(database.users);
});

// /signing --> POST = success/fail
app.post('/signin', (req, res) => {
  // verify email and password given match whats in db
  if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});


// /register --> PUT = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  // use knex to insert new user into database
  db('users')
    .returning('*')
    .insert({
    email,
    name,
    joined: new Date()
  })
    .then(user => {
      // respond with user object
      res.json(user[0]);
    })
    // if unable to register return error message
    .catch(err => res.status(400).json('unable to register'));

});

// /profile/:userID --> GET = user
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  // checks each user object to see if id exists
  db.select('*').from('users').where({ id })
    .then(user => {
      // if returned user has data stored return user
      if (user.length) {
        res.json(user[0]);
      } else {
        // otherwise, instead of returning empty array and status 200
        // return 400 and not found
        res.status(400).json('Not found');
      }
    })
    .catch(err => res.status(400).json('Error getting user'));
});


// /image --> PUT --> user
app.put('/image', (req, res) => {
  const { id } = req.body;

  // update entry count by 1 in users table for chosen user
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));

});

app.listen(3000);


