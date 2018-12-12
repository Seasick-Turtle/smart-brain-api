
const handleGetProfile = (req, res, db) => {
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
};

module.exports = {
  handleGetProfile
};