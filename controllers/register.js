const handleRegister = (req, res, db, bcrypt) => {
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

};

module.exports = {
  handleRegister
};