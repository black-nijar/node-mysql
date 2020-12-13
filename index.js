require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

db.connect((err) => {
  if (!err) {
    console.log('DATABASE CONNECTED');
  } else {
    console.log('CONNECTION FAILED', err);
  }
});

// routes
// CREATE
app.post('/api/employee', (req, res) => {
  const { name, age, position } = req.body;
  db.query(
    `INSERT INTO employees (name, age, position) VALUES(?, ?, ?)`,
    [name, age, position],
    (err, result) => {
      if (err) {
        console.log('ERROR :', err);
        res.json({ error: err });
      } else {
        console.log('ADDED EMPLOYEE', result);
        res.json({ msg: 'EMPLOYEE ADDED' });
      }
    }
  );
  return res.status(200).json({ msg: 'ADDED EMPLOYEE' });
});

// GET
app.get('/api/employees', (req, res) => {
  db.query(`SELECT * FROM crud.employees`, (err, result) => {
    if (err) {
      console.log('GET ERROR :', err);
      return res.send(err);
    } else {
      console.log('GET ', result);
      return res.json({ employees: result });
    }
  });
});

// GET Employee
app.get('/api/employee/:id', (req, res) => {
  const { id } = req.params;
  db.query(`SELECT * FROM employees WHERE id = ?`, id, (err, result) => {
    if (err) {
      console.log('GET ERROR :', err);
      return res.send(err);
    } else {
      console.log('GET ', result);
      return res.json({ employee: result });
    }
  });
});

// DELETE
app.delete('/api/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id = ?', id, (err, result) => {
    if (err) {
      console.log('ERROR :', err);
      res.send(err);
    } else {
      console.log('DELETE');
      res.send('EMPLOYEE REMOVED');
    }
  });
});

// UPDATE
app.put('/api/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, position } = req.body;
  db.query(
    `UPDATE employees SET name = ?, age = ?, position =? WHERE id = ?`,
    [name, age, position, id],
    (err, result) => {
      if (err) {
        console.log('ERROR :', err);
        res.send(err);
      } else {
        console.log('DELETE');
        res.send('EMPLOYEE UPDATED');
      }
    }
  );
});
app.listen(5000, () => console.log('server is running at 5000 '));
