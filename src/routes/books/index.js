/* eslint-disable quotes */
require('dotenv').config();
const { Router } = require('express');
const connection = require('../../connection/connection');
// eslint-disable-next-line camelcase
const validCode_ISBN = require('../../verify/validIsbn');
const connect = connection();
// const { connect } = require('../../app')

const router = Router();

let sql = '';

const structureBook = (result) => {
  const structure = result.map((book) => ({
    id: book.id,
    name: book.name,
    isbn: book.isbn,
    author: {
      id: book.author_id,
      name: book.author_name,
      country: book.country
    }
  }));

  return structure
}

router.get('/', (req, res, next) => {
  sql = `SELECT books.id, books.name, isbn, author_id, author.name as author_name, country FROM books inner Join author WHERE author.id = books.author_id AND books.deleteAt is null`;

  connect.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const structure = structureBook(result)
      res.status(200).json(structure);
    } else {
      res.status(400).send('Database is empty');
    }
  });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id) !== false) {
    return res.status(400).send('The ID must be a number');
  }
  // sql = `SELECT id, name, isbn, author_id, name, country FROM books WHERE id = ${id}`;
  sql = `SELECT books.id, books.name, isbn, author_id, author.name as author_name, country FROM books inner Join author
        WHERE author.id = books.author_id AND books.id = ?` // ${id}`;

  connect.query(sql, [id], (err, result) => {
    if (err) {
      // throw err;
      res.status(500).send('Internal server error')
    }
    if (result.length > 0) {
      const structure = structureBook(result)
      res.status(200).json(structure);
    } else {
      res.status(404).send('ID Nonexistent');
    }
  });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, isbn, author } = req.body;

  if (isNaN(id) !== false) {
    return res.status(400).send('The ID must be a number');
  }

  const correct = validCode_ISBN(isbn);
  if (!correct) {
    res
      .status(400)
      .json({
        Valid: false,
        Error: 'ISBN is invalid, check if each number is correct'
      });
  } else {
    sql = `SELECT * FROM books WHERE isbn = ? and id != ?`;
    connect.query(sql, [isbn, Number(id)], (err, result) => {
      if (err) {
        // throw err;
        res.status(500).send('Internal server error')
      }
      if (result.length > 0) {
        return res.status(400).send('The ISBN entered is already registered');
      } else {
        // sql = `UPDATE books SET name = '${name}',isbn = '${isbn}', author = '${author}' WHERE id = ${Number(id)}`;
        sql = `UPDATE books SET name = ?,isbn = ?, author = ? WHERE id = ?`;

        connect.query(sql, [name, isbn, author, Number(id)], (err, result) => {
          if (err) {
            // throw err;
            res.status(500).send('Internal server error')
          }

          if (result.changedRows > 0) {
            res.status(200).json({ Updated: true, book: 'The book has been updated correctly' });
          } else {
            res.status(400).send({ Updated: false, Error: 'Something was wrong, check that the ID is correct' })
          }
        });
      }
    });
  }
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  sql = `SELECT id FROM books WHERE id = ?`;

  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
      // throw err;
      res.status(500).send('Internal server error')
    }
    if (result.length > 0) {
      sql = `UPDATE books SET deleteAt = NOW() WHERE id = ? AND deleteAt is null`;
      connect.query(sql, [Number(id)], (err, result) => {
        if (err) {
          // throw err;
          res.status(500).send('Internal server error')
        }

        if (result.changedRows > 0) {
          res.status(200).json({ Deleted: true, book: 'The book is Deleted correctly' });
        } else {
          res.status(400).send({ Deleted: false, Error: 'In fact, this book has been previously removed.' })
        }
      });
    } else {
      res.status(400).send('ID Nonexistent');
    }
  });
});

router.post('/', (req, res, next) => {
  const { isbn, name, author } = req.body;
  if (!(isbn && name && author)) {
    return res.status(400).send('Verify, there can be no empty fields');
  }

  const correct = validCode_ISBN(isbn);
  if (!correct) {
    res
      .status(400)
      .json({
        Valid: false,
        Error: 'ISBN is invalid, check if each number is correct'
      });
  } else {
    sql = `SELECT * FROM books WHERE isbn = ?`;
    connect.query(sql, [isbn], (err, result) => {
      if (err) {
        // throw err;
        res.status(500).send('Internal server error')
      }
      if (result.length > 0) {
        return res.status(400).send('The ISBN entered is already registered');
      } else {
        sql = `INSERT INTO books(name, isbn, author) VALUES (?, ?, ?)`;

        connect.query(sql, [name, isbn, author], (err, result) => {
          if (err) {
            // throw err;
            res.status(500).send('Internal server error')
          }
        });
        res.status(200).json({ Save: true, book: 'The book is salved' });
      }
    });
  }
});

module.exports = router;
