require('dotenv').config();
const mysql = require('mysql');

const { DB_HOST, DB_PASSWORD, DB_USER, DB_DATABASE } = process.env;

// const createDataBase = (connec) => {
//     connec.query("CREATE DATABASE if not exists prue", (err, result) => {
//       if (err) throw err;
//       console.log("Database created");

//     });

//      return connec

// }

const createTableBooks = (connec) => {
  if (connec.config.database !== '') {
    connec.query(
      `CREATE TABLE if not exists books (
                id INT(11) NOT NULL AUTO_INCREMENT,
                name VARCHAR(150) NOT NULL COLLATE 'latin1_swedish_ci',
                isbn VARCHAR(17) NOT NULL COLLATE 'latin1_swedish_ci',
                author_id INT(11) NOT NULL,
                deleteAt DATETIME NULL DEFAULT NULL,
                PRIMARY KEY (id, isbn) USING BTREE,
                UNIQUE INDEX isbn (isbn) USING BTREE),
                INDEX FK_books_author (author_id) USING BTREE`,
      (error, resultado) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          // return;
        }
      }
    );
  }
};

const createTableAuthors = (connec) => {
  if (connec.config.database !== '') {
    connec.query(
      `CREATE TABLE if not exists authors (
                id INT(11) NOT NULL AUTO_INCREMENT,
                name VARCHAR(30) NOT NULL COLLATE 'latin1_swedish_ci',
                country VARCHAR(30) NOT NULL COLLATE 'latin1_swedish_ci',
                deleteAt DATETIME NULL DEFAULT NULL,
                PRIMARY KEY (id) USING BTREE,
                UNIQUE INDEX isbn (isbn) USING BTREE)`,
      (error, resultado) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          // return;
        }
      }
    );
  }
};

function connection () {
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
  });

  connection.connect((error) => {
    if (error) throw error;
    // eslint-disable-next-line no-console
    console.log('Established connection');
    // createDataBase(connection)
  });

  createTableBooks(connection);

  createTableAuthors(connection);

  return connection;
}

module.exports = connection;
