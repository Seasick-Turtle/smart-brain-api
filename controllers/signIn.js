const handleSignIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  // ensure the user enters all appropriate information
  if (!email || !password) {
    return res.status(400).json('incorrect form submission')
  }

  // get email and hash from login table
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {

      const isValid = bcrypt.compareSync(password, data[0].hash);

      //compare if email and password match
      if (isValid) {
        // if match is successful allow the user to login
        return db.select('*').from('users')
          .where('email', '=', email)
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
