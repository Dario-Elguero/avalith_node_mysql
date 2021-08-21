
const dataAuthor = (req, res, next) => {
    const { name, country } = req.body;
    
    if (!name || !country) {
        return res.status(400).send(`Fields cannot be empty`);
      }
    
      if (name.length > 30 || country.length > 30) {
        return res.status(400).send(`The length must not exceed 30 characters`);
      }
    
    next();
    
}

module.exports = dataAuthor;
