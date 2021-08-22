
const TYPE = require('../types');

const authorSQL = (query) => {

  switch (query) {
    case TYPE.SELECT_ALL_AUTHORS:
        return `SELECT id, name, country FROM authors
                WHERE deleteAt is null`;

    case TYPE.SELECT_AUTHOR_BY_ID:
        return `SELECT id, name, country, DATE_FORMAT(deleteAt, "%d-%m-%Y") as deleteAt FROM authors
                WHERE id = ?`;

    case TYPE.UPDATE_AUTHOR:
        return `UPDATE authors SET name = ?, country = ?
                WHERE id = ?`;

    case TYPE.DELETE_AUTHOR:
        return `UPDATE authors SET deleteAt = NOW()
                WHERE id = ? and deleteAt is null`;

    case TYPE.INSERT_AUTHOR:
        return `INSERT INTO authors(name, country)
                VALUES (?, ?)`;

    case TYPE.EXIST_AUTHOR:
        return `SELECT id FROM authors
                WHERE id = ?`;

    default:
      break;
  }
};

module.exports = authorSQL;
