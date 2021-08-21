const validCode_ISBN = (req, res, next) => {
  let { isbn } = req.body;

  isbn = isbn.replace(/-/g, "");

  const characters = isbn.split("");
  let sum = 0;
  let control = false;

  if (isbn.length === 10) {
    if (characters[9].toUpperCase() === "X") {
      characters[9] = 10;
    }

    for (let i = 0; i < characters.length; i++) {
      sum += (i + 1) * parseInt(characters[i]);
    }
    control = sum % 11 === 0;
  } else if (isbn.length === 13) {
    let calc = 1;
    for (let i = 0; i < characters.length - 1; i++) {
      if (calc === 1) {
        sum += calc * parseInt(characters[i]);
        calc = 3;
      } else {
        sum += calc * parseInt(characters[i]);
        calc = 1;
      }
    }

    let verify = 10 - (sum % 10);

    control = verify === Number(characters[12]);
  }

  if (control){
    next();
  }else{
    res
      .status(400)
      .json({
        Valid: false,
        Error: 'ISBN is invalid, check if each number is correct'
      });
  }
}

module.exports = validCode_ISBN;
