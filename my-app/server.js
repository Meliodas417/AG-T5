const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5000;

// Enable cross-origin requests
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Create connection to MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API endpoint to get data from database table
app.get('/api/kpis', (req, res) => {
    const query = 'SELECT * FROM kpi_table'; // Replace with your actual table name
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
            return;
        }
        res.json(results);
    });
});

// API endpoint to insert data into the database
app.post('/api/kpis', (req, res) => {
    const data = req.body;

    const query = 'INSERT INTO kpi_table (timestamp, signal_strength, application_type, resource_allocation) VALUES (?, ?, ?, ?)';

    // Loop through the CSV data sent from the front end
    data.forEach((row) => {
        const { Timestamp, Signal_Strength, Application_Type, Resource_Allocation } = row;

        db.query(query, [Timestamp, Signal_Strength, Application_Type, Resource_Allocation], (err, results) => {
            if (err) {
                console.log('Error inserting data:', err);
                res.status(500).send('Error inserting data into the database');
                return;
            }
        });
    });

    res.json({ message: 'Data inserted successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('API is running!');
});

