/* eslint-disable quotes */
require('dotenv').config();
const { Router } = require('express');
const connection = require('../../connection/connection');
const connect = connection();
// const { connect } = require('../../app')
const router = Router();

let sql = '';

router.get('/', (req, res, next) => {
  sql = `SELECT id, name, country FROM authors WHERE deleteAt is null`;

  connect.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.status(200).json(result);
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

  sql = `SELECT id, name, country, deleteAt FROM authors
        WHERE id = ?` // ${id}`;

  connect.query(sql, [id], (err, result) => {
    if (err) {
      // throw err;
      res.status(500).send('Internal server error')
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).send('ID Nonexistent');
    }
  });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name, country } = req.body;

  if (isNaN(id) !== false) {
    return res.status(400).send('The ID must be a number');
  }

  if (!name || !country) {
    return res.status(400).send(`Fields cannot be empty`);
  }

  if (name.length > 30 || country.length > 30) {
    return res.status(400).send(`The length must not exceed 30 characters`);
  }

  sql = `SELECT * FROM authors WHERE id = ?`;
  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
      // throw err;
      res.status(500).send('Internal server error - select')
    }
    if (result.length > 0) {
      sql = `UPDATE authors SET name = ?, country = ? WHERE id = ?`;

      connect.query(sql, [name, country, Number(id)], (err, result) => {
        if (err) {
          // throw err;
          res.status(500).send('Internal server error - update')
        }

        if (result.changedRows > 0) {
          res.status(200).json({ Updated: true, book: 'The Author has been updated correctly' });
        }
      });
    } else {
      res.status(400).send({ Updated: false, Error: 'Something was wrong, check that the ID is correct' })
    }
  });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  sql = `SELECT id FROM authors WHERE id = ?`;

  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
      // throw err;
      res.status(500).send('Internal server error')
    }
    if (result.length > 0) {
      sql = `UPDATE authors SET deleteAt = NOW() WHERE id = ? and deleteAt is null`;
      connect.query(sql, [Number(id)], (err, result) => {
        if (err) {
          // throw err;
          res.status(500).send('Internal server error')
        }

        if (result.changedRows > 0) {
          res.status(200).json({ Deleted: true, book: 'The Author is Deleted correctly' });
        } else {
          res.status(400).send({ Deleted: false, Error: 'In fact, this Author has been previously removed.' })
        }
      });
    } else {
      res.status(400).send('ID Nonexistent');
    }
  });
});

router.post('/', (req, res, next) => {
  const { name, country } = req.body;

  if (!name || !country) {
    return res.status(400).send(`Fields cannot be empty`);
  }

  if (name.length > 30 || country.length > 30) {
    return res.status(400).send(`The length must not exceed 30 characters`);
  }

  sql = `INSERT INTO authors(name, country) VALUES (?, ?)`;

  connect.query(sql, [name, country], (err, result) => {
    if (err) {
      // throw err;
      res.status(500).send('Internal server error')
    }
    res.status(200).json({ Save: true, author: 'The author is salved' });
  });
});

module.exports = router;