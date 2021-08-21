const validBook = (req, res, next) => {
  const { isbn, name, author } = req.body;

  if (!(name && author)) {
    return res.status(400).send("Verify, there can be no empty fields");
  }

  if (name.length > 150) {
    return res.status(400).send(`The length of the name must not exceed 150 characters`);
  }

  next();
};

module.exports = validBook;
