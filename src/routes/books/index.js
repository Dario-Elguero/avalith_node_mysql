/* eslint-disable quotes */
require('dotenv').config();
const { Router } = require('express');
const connection = require('../../connection/connection');
const validBook = require('../../verify/validBook');
const validId = require('../../verify/validId');
const TYPE = require("../types");
// eslint-disable-next-line camelcase
const validCode_ISBN = require('../../verify/validIsbn');
const bookSQL = require('../querySql/bookSql');
const connect = connection();

const router = Router();

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

  const sql = bookSQL(TYPE.SELECT_ALL_BOOKS)

  connect.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Internal server error')
    }
    if (result.length > 0) {
      const structure = structureBook(result)
      res.status(200).json(structure);
    } else {
      res.status(400).send('Database is empty');
    }
  });
});

router.get('/:id', validId, (req, res, next) => {
  const { id } = req.params;
    
  const sql = bookSQL(TYPE.SELECT_BOOK_BY_ID)

  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
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

router.put('/:id', validId, validCode_ISBN, validBook, (req, res, next) => {
  const { id } = req.params;
  const { name, isbn, author } = req.body;

    let sql = bookSQL(TYPE.EXIST_ISBN_PUT)
    connect.query(sql, [isbn, Number(id)], (err, result) => {
      if (err) {
        res.status(500).send('Internal server error')
      }
      if (result.length > 0) {
        return res.status(400).send('The ISBN entered is already registered');
      } else {
        
        sql = bookSQL(TYPE.UPDATE_BOOK)

        connect.query(sql, [name, isbn, author, Number(id)], (err, result) => {
          if (err) {
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
});

router.delete('/:id', validId, (req, res, next) => {
  const { id } = req.params;
  let sql = bookSQL(TYPE.EXIST_BOOK)

  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
      res.status(500).send('Internal server error')
    }
    if (result.length > 0) {
      sql =bookSQL(TYPE.DELETE_BOOK)
      connect.query(sql, [Number(id)], (err, result) => {
        if (err) {
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

router.post('/', validCode_ISBN, validBook, (req, res, next) => {
  const { isbn, name, author } = req.body;
  
  let sql = bookSQL(TYPE.EXIST_ISBN)
    connect.query(sql, [isbn], (err, result) => {
      if (err) {
        res.status(500).send('Internal server error')
      }
      if (result.length > 0) {
        return res.status(400).send('The ISBN entered is already registered');
      } else {
        sql = bookSQL(TYPE.INSERT_BOOK)

        connect.query(sql, [name, isbn, author], (err, result) => {
          if (err) {
            return res.status(500).send('Internal server error')
          }
          res.status(200).json({ Save: true, book: 'The book is salved' });
        });
      }
    });
});

module.exports = router;
