const handleSignIn = (req, res, db, bcrypt) => {

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
};

module.exports = {
  handleSignIn
};
