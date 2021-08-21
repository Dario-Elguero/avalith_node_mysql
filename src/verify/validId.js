const validId = (req, res, next) => {
    const { id } = req.params;
  
  if (isNaN(id) !== false) {
    return res.status(400).send('The ID must be a number');
  }

  next();
    
}

module.exports = validId;
