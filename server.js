const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : process.env.PG_PASSWORD,
    database : 'smart_brain'
  }
});

postgres.select('*').from('users').then(data => {
  console.log(data);
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
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  // responds with newest user
  res.json(database.users[database.users.length - 1]);
});

// /profile/:userID --> GET = user
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  // checks each user object to see if id exists
  database.users.forEach(user => {
    if (user.id === id) {
      // if it does, set found to true, return user
      found = true;
      return res.json(user);
    }
  });

  // otherwise error
  if(!found) {
    res.status(400).json('not found');
  }
});


// /image --> PUT --> user
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      // if user id is found update entries by one for each submission
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if(!found) {
    res.status(400).json('not found');
  }
});

app.listen(3000);


