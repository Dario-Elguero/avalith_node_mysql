const TYPE = require('../types');

const bookSQL = (query) => {
    
  switch (query) {
    case TYPE.SELECT_ALL_BOOKS:
        return `SELECT books.id, books.name, isbn, author_id, authors.name as author_name, country FROM books inner Join authors WHERE authors.id = books.author_id AND books.deleteAt is null`;

    case TYPE.SELECT_BOOK_BY_ID:
        return `SELECT books.id, books.name, isbn, author_id, authors.name as author_name, country FROM books inner Join authors
                WHERE authors.id = books.author_id AND books.id = ?`;

    case TYPE.UPDATE_BOOK:
        return `UPDATE books SET name = ?,isbn = ?, author_id = ?
                WHERE id = ?`;

    case TYPE.DELETE_BOOK:
        return `UPDATE books SET deleteAt = NOW()
                WHERE id = ? and deleteAt is null`;

    case TYPE.INSERT_BOOK:
        return `INSERT INTO books(name, isbn, author_id)
                VALUES (?, ?, ?)`;

    case TYPE.EXIST_BOOK:
        return `SELECT id FROM books
                WHERE id = ?`;

    case TYPE.EXIST_ISBN:
        return `SELECT id FROM books
                WHERE isbn = ?`;

    case TYPE.EXIST_ISBN_PUT:
        return `SELECT id FROM books
                WHERE isbn = ? and id != ?`;

    default:
      break;
  }
};

module.exports = bookSQL;
