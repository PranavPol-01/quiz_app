const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // Change port if needed

// Use CORS and body-parser
app.use(cors());
app.use(bodyParser.json());

// CSV file path
const csvFilePath = path.join(__dirname, '../frontend/public/user.csv');

// Endpoint to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Read the current content of the CSV file
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading CSV file' });
        }

        // Ensure the file ends with a newline character
        
        // if (lines[lines.length - 1] !== '') {
        //     // If the last line is not empty, add a newline
        //     data += '\n';
        // }

        // Prepare the new entry
        const newEntry = `${username.trim()},${password.trim()}\n`; // Ensure each entry ends with a newline

        // Append the new entry to the CSV content
        const updatedData = data + newEntry;

        // Write the updated data back to the CSV file
        fs.writeFile(csvFilePath, updatedData, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing to CSV file' });
            }
            res.status(200).json({ message: 'Registration successful!' });
        });
    });
});

const csvFilePath1 = path.join(__dirname, '../frontend/public/user_scores.csv');

// Endpoint to submit quiz results
app.post('/submit-quiz', (req, res) => {
    const { userName, score, difficulty } = req.body;

    // Validate input
    if (!userName || score === undefined || !difficulty) {
        return res.status(400).json({ message: 'User name, score, and difficulty are required' });
    }

    // Prepare the new entry
    const newEntry = `${userName},${score},${difficulty}\n`;
    

    // Append the new entry to the CSV content
    const updatedData = data + newEntry;
    // Append the new entry to the CSV file
    fs.appendFile(csvFilePath1, updatedData, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error writing to CSV file' });
        }
        res.status(200).json({ message: 'Quiz results submitted successfully!' });
    });
});

const csvFilePath2 = '../frontend/public/user_scores.csv';
const csvWriter = createObjectCsvWriter({
  path: csvFilePath2,
  header: [
    { id: 'userName', title: 'userName' },
    { id: 'score', title: 'score' },
    { id: 'difficulty', title: 'difficulty' }
  ],
  append: true, // This option allows appending data to an existing CSV
});

// Ensure CSV file exists and has headers if not present
if (!fs.existsSync(csvFilePath)) {
  csvWriter.writeRecords([]).then(() => console.log('CSV file created with headers.'));
}

// Endpoint to handle quiz submission
app.post('/submit-quiz', (req, res) => {
  const { userName, score, difficulty } = req.body;

  // Append data to the CSV file
  csvWriter.writeRecords([{ userName, score, difficulty }])
    .then(() => {
      res.status(200).json({ message: 'Quiz data saved successfully' });
    })
    .catch(error => {
      console.error('Error writing to CSV:', error);
      res.status(500).json({ message: 'Failed to save quiz data' });
    });
});

app.get('/get-quiz-data', (req, res) => {
    const results = [];
  
    fs.createReadStream(csvFilePath1)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.status(200).json(results); // Return the parsed CSV data as JSON
      })
      .on('error', (err) => {
        res.status(500).json({ message: 'Error reading CSV file' });
      });
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});