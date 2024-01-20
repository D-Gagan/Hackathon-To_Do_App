// app.js - Backend
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ohhh###77@',
  database: 'todo_app'
};

// Serve static files (HTML and JS) from the 'public' directory
app.use(express.static('public'));

app.use(bodyParser.json());

const pool = mysql.createPool(dbConfig);

async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        task VARCHAR(255) NOT NULL
      )
    `);
  } finally {
    connection.release();
  }
}

// Welcome message for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the ToDo App!');
});

app.get('/tasks', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM tasks');
    res.json(rows);
  } finally {
    connection.release();
  }
});

app.post('/tasks', async (req, res) => {
  const newTask = {
    task: req.body.task
  };

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query('INSERT INTO tasks SET ?', [newTask]);
    newTask.id = result.insertId;
    res.status(201).json(newTask);
  } finally {
    connection.release();
  }
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = {
    task: req.body.task
  };

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query('UPDATE tasks SET ? WHERE id = ?', [updatedTask, taskId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    updatedTask.id = taskId;
    res.json(updatedTask);
  } finally {
    connection.release();
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id);
  const confirmationMessage = req.body.confirmation;

  const connection = await pool.getConnection();

  try {
    const [taskResult] = await connection.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (taskResult.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate confirmation message before deleting
    const [confirmationResult] = await connection.query(
      'DELETE FROM tasks WHERE id = ? AND task = ?',
      [taskId, confirmationMessage]
    );

    if (confirmationResult.affectedRows === 0) {
      return res.status(400).json({ error: 'Confirmation failed. Please provide the correct confirmation message.' });
    }

    res.json({ message: 'Task deleted successfully' });
  } finally {
    connection.release();
  }
});

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error('Error initializing database:', err));
