### Setup SQL Database

```
CREATE DATABASE quiz;
USE quiz;

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  question TEXT NOT NULL,
  option1 TEXT NOT NULL,
  option2 TEXT NOT NULL,
  option3 TEXT NOT NULL,
  option4 TEXT NOT NULL,
  answer INT NOT NULL
);
```

### Quiz API
This is a REST API built with Node.js and MySQL that allows clients to create and answer quiz questions, and track their scores.

### API endpoints
The following endpoints are available:

#### POST /questions
Creates a new quiz question. Expects a JSON object with the following properties:

title (string): the title of the quiz
description (string): a description of the quiz
question (string): the question being asked
options (array of objects): the answer options for the question, each with the following properties:
text (string): the text of the answer option
isCorrect (boolean): whether the answer is correct or not
Returns a JSON object with the ID of the new question.

#### POST /answers
Submits an answer to a quiz question. Expects a JSON object with the following properties:

questionId (number): the ID of the question being answered
answer (number): the number (1-4) of the answer option selected by the client
Returns a JSON object with the client's current score and percentage correct.