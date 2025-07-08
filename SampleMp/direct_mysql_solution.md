# Using MySQL Directly for Grind Factory Gym Website

This guide explains how to set up and use MySQL directly for your gym website without relying on PHP.

## Approach Overview

Instead of using PHP as a backend, we'll:
1. Set up the MySQL database
2. Create stored procedures for common operations
3. Use MySQL Workbench for database management
4. Connect directly from JavaScript using AJAX and a lightweight API server

## MySQL Setup

### Step 1: Install MySQL Server

1. Download MySQL Community Server from [MySQL's website](https://dev.mysql.com/downloads/mysql/)
2. Follow the installation instructions
3. Make note of your root password during installation

### Step 2: Install MySQL Workbench

1. Download MySQL Workbench from [MySQL's website](https://dev.mysql.com/downloads/workbench/)
2. Install and open MySQL Workbench
3. Connect to your local MySQL server using the credentials from installation

### Step 3: Create and Initialize the Database

1. In MySQL Workbench, create a new connection to your local MySQL server
2. Open a new SQL tab and run the SQL script from `database_setup.sql`
3. Verify tables were created by checking the schemas panel

## Creating Stored Procedures

Stored procedures allow you to encapsulate functionality within the database itself. Here are some essential stored procedures for your gym website:

### User Registration Procedure

```sql
DELIMITER //
CREATE PROCEDURE RegisterUser(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    
    -- Check if email already exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE email = p_email;
    
    IF user_exists = 0 THEN
        -- Insert new user
        INSERT INTO users (name, email, password)
        VALUES (p_name, p_email, p_password);
        
        -- Return success
        SELECT 'success' AS result, LAST_INSERT_ID() AS user_id;
    ELSE
        -- Return error
        SELECT 'error' AS result, 'Email already exists' AS message;
    END IF;
END //
DELIMITER ;
```

### User Login Procedure

```sql
DELIMITER //
CREATE PROCEDURE LoginUser(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_id INT;
    DECLARE stored_password VARCHAR(255);
    
    -- Get user info
    SELECT id, password INTO user_id, stored_password
    FROM users
    WHERE email = p_email;
    
    -- Check if user exists and password matches
    IF user_id IS NOT NULL AND stored_password = p_password THEN
        -- Update last login time
        UPDATE users SET last_login = CURRENT_TIMESTAMP 
        WHERE id = user_id;
        
        -- Return user info
        SELECT 'success' AS result, id, name, email
        FROM users
        WHERE id = user_id;
    ELSE
        -- Return error
        SELECT 'error' AS result, 'Invalid email or password' AS message;
    END IF;
END //
DELIMITER ;
```

### Submit Membership Procedure

```sql
DELIMITER //
CREATE PROCEDURE SubmitMembership(
    IN p_user_id INT,
    IN p_plan_type VARCHAR(20)
)
BEGIN
    DECLARE start_date DATE;
    DECLARE end_date DATE;
    
    -- Set dates
    SET start_date = CURDATE();
    SET end_date = DATE_ADD(CURDATE(), INTERVAL 1 MONTH);
    
    -- Insert membership
    INSERT INTO memberships (user_id, plan_type, start_date, end_date)
    VALUES (p_user_id, p_plan_type, start_date, end_date);
    
    -- Return success
    SELECT 'success' AS result, LAST_INSERT_ID() AS membership_id;
END //
DELIMITER ;
```

### Get Trainers Procedure

```sql
DELIMITER //
CREATE PROCEDURE GetTrainers()
BEGIN
    SELECT * FROM trainers ORDER BY id;
END //
DELIMITER ;
```

### Get Services Procedure

```sql
DELIMITER //
CREATE PROCEDURE GetServices()
BEGIN
    SELECT * FROM services ORDER BY id;
END //
DELIMITER ;
```

## Creating a Lightweight API Server

Since browsers can't connect directly to MySQL, you'll need a minimal server to handle the database operations. Here's how to set up a lightweight server without PHP:

### Using Node.js Express (Minimal Setup)

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Create a new folder for your server
3. Initialize a new Node.js project: `npm init -y`
4. Install required packages: `npm install express mysql cors body-parser`
5. Create a file called `server.js` with this code:

```javascript
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password', // Replace with your password
  database: 'gym_database'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API Routes
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Call stored procedure
  db.query('CALL RegisterUser(?, ?, ?)', [name, email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    
    const result = results[0][0];
    if (result.result === 'success') {
      return res.json({ success: true, user_id: result.user_id });
    } else {
      return res.json({ success: false, message: result.message });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Call stored procedure
  db.query('CALL LoginUser(?, ?)', [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    
    const result = results[0][0];
    if (result.result === 'success') {
      return res.json({ 
        success: true, 
        user: {
          id: result.id,
          name: result.name,
          email: result.email
        }
      });
    } else {
      return res.json({ success: false, message: result.message });
    }
  });
});

app.get('/trainers', (req, res) => {
  db.query('CALL GetTrainers()', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    
    return res.json({ success: true, trainers: results[0] });
  });
});

app.get('/services', (req, res) => {
  db.query('CALL GetServices()', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    
    return res.json({ success: true, services: results[0] });
  });
});

app.post('/membership', (req, res) => {
  const { user_id, plan_type } = req.body;
  
  db.query('CALL SubmitMembership(?, ?)', [user_id, plan_type], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    
    const result = results[0][0];
    return res.json({ success: true, membership_id: result.membership_id });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

6. Start the server: `node server.js`

## Updating JavaScript to Connect to Your API

Modify your existing JavaScript code to connect to your Node.js API server instead of PHP:

```javascript
// Register function
function registerUser(name, email, password) {
  return fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })
  .then(response => response.json());
}

// Login function
function loginUser(email, password) {
  return fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json());
}

// Get trainers
function getTrainers() {
  return fetch('http://localhost:3000/trainers')
    .then(response => response.json());
}

// Get services
function getServices() {
  return fetch('http://localhost:3000/services')
    .then(response => response.json());
}

// Submit membership
function submitMembership(userId, planType) {
  return fetch('http://localhost:3000/membership', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_id: userId, plan_type: planType })
  })
  .then(response => response.json());
}
```

## Benefits of This Approach

1. **More Direct Database Control**: You work directly with MySQL for data operations
2. **Stored Procedures**: Logic is encapsulated within the database
3. **Clear Separation**: Frontend and database are clearly separated
4. **Lightweight Backend**: Minimal server code needed
5. **Better Security**: Password handling and input validation at database level

## Considerations

1. **Password Storage**: In a production environment, you should hash passwords before storing them
2. **Authentication**: Implement proper authentication with tokens
3. **Connection Pooling**: For better performance, use connection pooling in the Node.js server
4. **Error Handling**: Add more robust error handling in both the API and stored procedures
5. **Deployment**: When deploying, consider using environment variables for database credentials

This approach gives you direct control over your MySQL database while still providing a clean way to connect it to your frontend. 