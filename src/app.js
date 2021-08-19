const express = require('express');
const books = require('./routes/books');
const authors = require('./routes/authors');

// const connection = require('../src/connection/connection');
// const connect = connection();

const server = express();

server.name = 'API';

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use('/books', books);
server.use('/authors', authors);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(status).send(message);
});

module.exports = { server };
