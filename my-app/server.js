const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5000;

// Enable cross-origin requests
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Create a new SQLite database connection
const db = new sqlite3.Database('./kpi_database.db',sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');

    db.run(`
        CREATE TABLE IF NOT EXISTS kpi_table (
            timestamp TEXT,
            signal_strength REAL,
            application_type TEXT,
            resource_allocation REAL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "kpi_table" created or already exists.');
        }
    });

});

// API endpoint to get data from database table
app.get('/api/kpis', (req, res) => {
    const query = 'SELECT * FROM kpi_table'; 
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data from database');
            return;
        }
        res.json(rows);
    });
});

// API endpoint to insert data into the database
app.post('/api/kpis', (req, res) => {
    const data = req.body;

    const query = 'INSERT INTO kpi_table (timestamp, signal_strength, application_type, resource_allocation) VALUES (?, ?, ?, ?)';

    // Loop through the CSV data sent from the front end
    data.forEach((row) => {
        const { Timestamp, Signal_Strength, Application_Type, Resource_Allocation } = row;

        db.run(query, [Timestamp, Signal_Strength, Application_Type, Resource_Allocation], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
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

