const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5500;

// Create database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '#Pranay686',
  database: 'gym_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// API Routes
app.post('/api/attendance/check-in', async (req, res) => {
  try {
    const { user_id } = req.body;
    const check_in = new Date();
    
    const [result] = await promisePool.query(
      'INSERT INTO attendance (user_id, check_in) VALUES (?, ?)',
      [user_id, check_in]
    );
    
    res.json({ 
      success: true, 
      message: 'Check-in recorded successfully', 
      attendance_id: result.insertId 
    });
  } catch (err) {
    console.error('Error recording check-in:', err);
    res.status(500).json({ success: false, message: 'Error recording check-in' });
  }
});

app.post('/api/attendance/check-out', async (req, res) => {
  try {
    const { user_id } = req.body;
    const check_out = new Date();
    
    const [result] = await promisePool.query(
      'UPDATE attendance SET check_out = ? WHERE user_id = ? AND check_out IS NULL',
      [check_out, user_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'No active attendance record found' });
    }
    
    res.json({ success: true, message: 'Check-out recorded successfully' });
  } catch (err) {
    console.error('Error recording check-out:', err);
    res.status(500).json({ success: false, message: 'Error recording check-out' });
  }
});

app.get('/api/attendance/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { start_date, end_date } = req.query;
  
  let query = 'SELECT * FROM attendance WHERE user_id = ?';
  const params = [user_id];
  
  if (start_date && end_date) {
    query += ' AND DATE(check_in) BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }
  
  query += ' ORDER BY check_in DESC';
  
  promisePool.query(query, params)
    .then(([results]) => {
      res.json({ success: true, attendance: results });
    })
    .catch((err) => {
      console.error('Error fetching attendance:', err);
      res.status(500).json({ success: false, message: 'Error fetching attendance records' });
    });
});

// Get attendance status for a user
app.get('/api/attendance/status/:user_id', (req, res) => {
    const userId = req.params.user_id;
    
    const query = `
        SELECT * FROM attendance 
        WHERE user_id = ? 
        AND DATE(check_in) = CURDATE() 
        AND check_out IS NULL
    `;
    
    promisePool.query(query, [userId])
      .then(([results]) => {
        res.json({
            success: true,
            isCheckedIn: results.length > 0
        });
      })
      .catch((err) => {
        console.error('Error checking attendance status:', err);
        res.status(500).json({ success: false, message: 'Error checking attendance status' });
      });
});

// Add attendance history endpoint
app.get('/api/attendance/history/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [results] = await promisePool.query(`
      SELECT 
        id,
        user_id,
        check_in as timestamp,
        'check-in' as type
      FROM attendance 
      WHERE user_id = ? 
      UNION ALL
      SELECT 
        id,
        user_id,
        check_out as timestamp,
        'check-out' as type
      FROM attendance 
      WHERE user_id = ? AND check_out IS NOT NULL
      ORDER BY timestamp DESC
    `, [user_id, user_id]);
    
    res.json({ success: true, history: results });
  } catch (err) {
    console.error('Error fetching attendance history:', err);
    res.status(500).json({ success: false, message: 'Error fetching attendance history' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Adjust table/field names as per your DB schema
    const [rows] = await promisePool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length > 0) {
      // Remove password before sending user object
      const user = { ...rows[0] };
      delete user.password;
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: 'Invalid email or password.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Serve static files with proper error handling
app.use(express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/main.css', express.static(path.join(__dirname, 'main.css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Static files are being served from:', __dirname);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
}); 