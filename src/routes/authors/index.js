/* eslint-disable quotes */
require("dotenv").config();
const { Router } = require("express");
const connection = require("../../connection/connection");
const dataAuthor = require("../../verify/validAuthor");
const validId = require("../../verify/validId");
const authorSQL = require("../querySql/authorSql");
const TYPE = require("../types");
const connect = connection();
// const { connect } = require('../../app')
const router = Router();

router.get("/", (req, res, next) => {
  
  const sql = authorSQL(TYPE.SELECT_ALL_AUTHORS);

  connect.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Internal server error");
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(400).send("Database is empty");
    }
  });
});

router.get("/:id", validId, (req, res, next) => {
  const { id } = req.params;

  const sql = authorSQL(TYPE.SELECT_AUTHOR_BY_ID);

  connect.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send("Internal server error");
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).send("ID Nonexistent");
    }
  });
});

router.put("/:id", validId, dataAuthor, (req, res, next) => {
  const { id } = req.params;
  const { name, country } = req.body;

  let sql = authorSQL(TYPE.EXIST_AUTHOR);

  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
      res.status(500).send("Internal server error - select");
    }
    if (result.length > 0) {
      sql = authorSQL(TYPE.UPDATE_AUTHOR);

      connect.query(sql, [name, country, Number(id)], (err, result) => {
        if (err) {
          res.status(500).send("Internal server error - update");
        }

        if (result.changedRows > 0) {
          res
            .status(200)
            .json({
              Updated: true,
              book: "The Author has been updated correctly",
            });
        }
      });
    } else {
      res
        .status(400)
        .send({
          Updated: false,
          Error: "Something was wrong, check that the ID is correct",
        });
    }
  });
});

router.delete("/:id", validId, (req, res, next) => {
  const { id } = req.params;
  let sql = authorSQL(TYPE.EXIST_AUTHOR);

  connect.query(sql, [Number(id)], (err, result) => {
    if (err) {
      res.status(500).send("Internal server error");
    }
    if (result.length > 0) {
      sql = authorSQL(TYPE.DELETE_AUTHOR);
      connect.query(sql, [Number(id)], (err, result) => {
        if (err) {
          res.status(500).send("Internal server error");
        }

        if (result.changedRows > 0) {
          res
            .status(200)
            .json({ Deleted: true, book: "The Author is Deleted correctly" });
        } else {
          res
            .status(400)
            .send({
              Deleted: false,
              Error: "In fact, this Author has been previously removed.",
            });
        }
      });
    } else {
      res.status(400).send("ID Nonexistent");
    }
  });
});

router.post("/", dataAuthor, (req, res, next) => {
  const { name, country } = req.body;

  const sql = authorSQL(TYPE.INSERT_AUTHOR);

  connect.query(sql, [name, country], (err, result) => {
    if (err) {
      res.status(500).send("Internal server error");
    }
    res.status(200).json({ Save: true, author: "The author is salved" });
  });
});

module.exports = router;
