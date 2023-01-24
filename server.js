const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const port = process.env.PORT;

require("dotenv").config();

app.use(cors());

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM tbl_register", (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({ message: "No users found." });
      }
    } catch (err) {
      res.json({ message: err });
    }
  });
});
app.post("/register", (req, res) => {
  const { firstName, lastName, email, mobile, address, question1, question2 } =
    req.body;

  connection.query(
    "INSERT INTO tbl_register (firstName, lastName, email, mobile, address, question1, question2) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [firstName, lastName, email, mobile, address, question1, question2],
    (err, results) => {
      try {
        if (results.affectedRows > 0) {
          res.json({ message: "Data has been added!" });
          console.log(results);
        } else if (results.affectedRows) {
          res.json({ message: "Something went wrong." });
        }
      } catch (err) {
        res.json({ message: err });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
