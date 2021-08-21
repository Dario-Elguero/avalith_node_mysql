function validCode_ISBN(isbn) {
  isbn = isbn.replace(/-/g, "");

  const characters = isbn.split("");
  let sum = 0;

  if (isbn.length === 10) {
    if (characters[9].toUpperCase() === "X") {
      characters[9] = 10;
    }

    for (let i = 0; i < characters.length; i++) {
      sum += (i + 1) * parseInt(characters[i]);
    }
    return sum % 11 == 0;
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

    return verify === Number(characters[12]);
  } else {
    return false;
  }
}

module.exports = validCode_ISBN;
