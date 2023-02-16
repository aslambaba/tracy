const express = require('express');
const serverless = require('serverless-http')
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();


const app = express();
const router = express.Router();

// create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});


router.get('/', (req, res) => {
  // Construct HTML page with tags
  const html = `
    <p>Go to Route <b>" /questions "</b> to see all the questions that you store in SQL DB</p>
    <p> <b>/answers</b> is used from postman to get answer of perticular question so you need to pass question ID while
    accessing that endpoint in postman</p>
  `;
  
  // Send HTML page to client
  res.send(html);
});

// Define route for retrieving all questions
router.get('/questions', (req, res) => {
  // Construct SQL query to retrieve all questions
  const query = 'SELECT * FROM questions';
  
  // Execute SQL query
  connection.query(query, (err, results) => {
    if (err) {
      console.log('Error retrieving questions from database:', err);
      res.status(500).send('Internal server error');
    } else {
      console.log('Retrieved questions:', results);
      res.json(results);
    }
  });
});

// API endpoint for page#1 to add a new quiz question
router.post('/questions', (req, res) => {
  const { title, description, question, option1, option2, option3, option4, answer } = req.body;
  const sql = 'INSERT INTO questions (title, description, question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [title, description, question, option1, option2, option3, option4, answer];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding question');
    } else {
      res.status(201).send('Question added successfully');
    }
  });
});

// API endpoint for page#2 to submit answer of a perticular question and save result to show the score at the end.
router.post('/check-answer/:questionId', (req, res) => {
  const questionId = req.params.questionId;
  const answer = req.body.answer;
  
  // Construct SQL query to retrieve correct answer to question
  const query = 'SELECT answer FROM questions WHERE id = ?';
  
  // Execute SQL query
  connection.query(query, [questionId], (err, results) => {
    if (err) {
      console.log('Error retrieving answer from database:', err);
      res.status(500).send('Internal server error');
    } else {
      // Check if answer is correct
      const isCorrect = answer === results[0].answer;
      console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'}`);
      res.json({ isCorrect });
    }
  });
});

app.use('/.netlify/functions/api', router)
module.exports.handler = serverless(app)