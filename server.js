const express = require('express');

const app = express();

// const to hold temp database objects
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
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
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.listen(3000, () => {
  console.log('works');
});


