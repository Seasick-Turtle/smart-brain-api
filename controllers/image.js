const getImageCount = (req, res, db) => {
  const { id } = req.body;

  // update entry count by 1 in users table for chosen user
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));

};

module.exports = {
  getImageCount
};