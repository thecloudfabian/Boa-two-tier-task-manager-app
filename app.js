const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'boa-db.cyl684yk24md.us-east-1.rds.amazonaws.com',
  user: 'adminboa',
  password: 'boaboa123&&&',
  database: 'boaapp'
});

db.connect((err) => {
  if (err) {
    console.log('DB Error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

db.query(`
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task VARCHAR(255) NOT NULL
)
`);

app.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    let html = `
      <h1>BOA Task Manager</h1>
      <form method="POST" action="/add">
        <input name="task" placeholder="Enter task" required />
        <button type="submit">Add</button>
      </form>
      <ul>
    `;

    results.forEach(row => {
      html += `<li>${row.task}</li>`;
    });

    html += '</ul>';
    res.send(html);
  });
});

app.post('/add', (req, res) => {
  db.query(
    'INSERT INTO tasks (task) VALUES (?)',
    [req.body.task],
    () => res.redirect('/')
  );
});

app.listen(80, () => {
  console.log('App running on port 80');
});
