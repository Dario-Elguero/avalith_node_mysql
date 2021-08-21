
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

const idAuthor = (req, res, next) => {
    const { id } = req.params;
  
  if (isNaN(id) !== false) {
    return res.status(400).send('The ID must be a number');
  }

  next();
    
}

module.exports = {dataAuthor, idAuthor};
