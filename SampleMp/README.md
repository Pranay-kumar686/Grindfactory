# Grind Factory Gym Website

A modern, responsive website for Grind Factory Gym with direct MySQL integration.

## Features

- Responsive design for all devices
- User authentication (login/register)
- Trainer profiles with videos
- Membership plans and registration
- Services showcase
- Direct MySQL database integration

## Installation and Setup

### Prerequisites

- MySQL 8.0 or higher
- MySQL Workbench (for database management)
- Node.js (for the lightweight API server)

### Database Setup

1. Install MySQL Server and MySQL Workbench from [MySQL's website](https://dev.mysql.com/downloads/)

2. Create a MySQL database named `gym_database`:

```sql
CREATE DATABASE gym_database;
```

3. Import the database structure from `database_setup.sql`:

```
File > Open SQL Script > [Select database_setup.sql] > Execute
```

4. Import stored procedures from `stored_procedures.sql`:

```
File > Open SQL Script > [Select stored_procedures.sql] > Execute
```

### API Server Setup

1. Create a new folder for your server (e.g., `server`)

2. Install Node.js from [nodejs.org](https://nodejs.org/)

3. Initialize a new Node.js project and install required packages:

```bash
cd server
npm init -y
npm install express mysql cors body-parser
```

4. Create a file called `server.js` with the code from `direct_mysql_solution.md`

5. Update the database connection in `server.js`:

```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Your MySQL username
  password: 'password',  // Your MySQL password
  database: 'gym_database'
});
```

6. Start the server:

```bash
node server.js
```

7. Open your website in a browser (locally):

```
http://localhost:3000
```

## Directory Structure

- `index.html` - Main HTML file
- `script.js` - Main JavaScript file
- `main.css/` - CSS files for different sections
- `database_setup.sql` - Database schema and sample data
- `stored_procedures.sql` - MySQL stored procedures
- `server/server.js` - Lightweight API server
- `images/` - Image assets
- `videos/` - Video files for trainer profiles

## MySQL Components

- **Stored Procedures**: Business logic encapsulated in database
- **Database Schema**: Tables for users, memberships, trainers, services
- **Reports**: SQL queries for business intelligence
- **Data Validation**: Input validation at database level

## Running Queries with MySQL Workbench

You can use MySQL Workbench to run queries and manage your database:

1. Connect to your database in MySQL Workbench
2. Run queries in the SQL Editor
3. Use stored procedures to perform operations:

```sql
-- Register a new user
CALL RegisterUser('John Doe', 'john@example.com', 'password123');

-- Get all trainers
CALL GetTrainers();

-- Get active memberships report
CALL GetActiveMembershipsReport();
```

## Usage

1. Register a new account through the registration form
2. Log in with your credentials
3. Browse trainers and services
4. Sign up for a membership plan

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Font Awesome for icons
- Chris Bumstead and Ramon Dino for trainer content
- MySQL Community for database technology
- [Your Name] for development 