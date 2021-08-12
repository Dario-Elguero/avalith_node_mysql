require("dotenv").config();
const { Router } = require("express");
const connection = require("../connection/connection");
const validCode_ISBN = require("../verify/validIsbn");
const connect = connection();

const router = Router();

let sql = "";

router.get("/books", (req, res, next) => {
  sql = `SELECT * FROM books`;

  connect.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(200).json(result);
    }else{
      return res.status(400).send('Database is empty');
    }
  });
});

router.get("/books/:id", (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id) != false) {
    return res.send("The ID must be a number");
  }
  sql = `SELECT * FROM books WHERE id = ${id}`;

  connect.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      res.status(404).send("ID Nonexistent");
    }
  });
});

router.put("/books/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, isbn, author } = req.body;

  if (isNaN(id) != false) {
    return res.send("The ID must be a number");
  }

  let correct = validCode_ISBN(isbn);
  if (!correct) {
    res
      .status(400)
      .json({
        Valid: false,
        Error: "ISBN is invalid, check if each number is correct",
      });
  } else {
    sql = `SELECT * FROM books WHERE isbn = "${isbn}" and id != ${Number(id)}`;
    connect.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).send("The ISBN entered is already registered");
      } else {
        sql = `UPDATE books SET name = '${name}',isbn = '${isbn}', author = '${author}' WHERE id = ${Number(id)}`;

        connect.query(sql, (err, result) => {
          if (err) throw err;
          
          if(result.changedRows > 0){
            res.status(200).json({ Updated: true, book: "The book has been updated correctly" });
          }else{
            res.status(400).send({ Updated: false, Error: "Something was wrong, check that the ID is correct" })
          }

        });
      }
    });
  }
  
});

router.delete("/books/:id", (req, res, next) => {
  const { id } = req.params;
  sql = `SELECT * FROM books WHERE id = ${id}`;

  connect.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      sql = `UPDATE books SET deleteAt = NOW() WHERE id = ${Number(id)} and deleteAt is null`;
      connect.query(sql, (err, result) => {
        if (err) throw err;
        
        if(result.changedRows > 0){
           res.status(200).json({ Deleted: true, book: "The book is Deleted correctly" });
        }else{
           res.status(400).send({ Deleted: false, Error: "In fact, this book has been previously removed." })
        }
      });
    }else{
      res.status(400).send('ID Nonexistent');
    }
  });
});

router.post("/books", (req, res, next) => {
  let { isbn, name, author } = req.body;
  if (!(isbn && name && author)) {
    return res.status(400).send("Verify, there can be no empty fields");
  }

  let correct = validCode_ISBN(isbn);
  if (!correct) {
    res
      .status(400)
      .json({
        Valid: false,
        Error: "ISBN is invalid, check if each number is correct",
      });
  } else {
    sql = `SELECT * FROM books WHERE isbn = "${isbn}"`;
    connect.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).send("The ISBN entered is already registered");
      } else {
        sql = `INSERT INTO books(name, isbn, author) VALUES ('${name}','${isbn}','${author}')`;

        connect.query(sql, (err, result) => {
          if (err) throw err;
        });
        res.status(200).json({ Save: true, book: "The book is salved" });
      }
    });
  }
});

module.exports = router;
