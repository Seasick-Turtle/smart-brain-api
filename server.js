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

// / --> res = this is working
app.get('/', (req, res) => {
  res.send(database.users);
});

// /signing --> POST = success/fail
app.post('/signin', (req, res) => {

  // get email and hash from login table
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {

      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

      //compare if email and password match
      if (isValid) {
        // if match is successful allow the user to login
       return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            // return first matching user
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        // otherwise return with 400 status and error message
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
});


// /register --> PUT = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  // use transaction to keep login and user tables consistent with each other
  // on failure, rollback and queries
  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        // if insertion was successful enter new user's credentials into login table
        // match email with loginEmail into users table
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date()
          })
          .then(user => {
            // respond with user object
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })

  // use knex to insert new user into database

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


