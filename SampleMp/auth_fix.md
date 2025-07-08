# MySQL Authentication Fix Guide

You're encountering a common authentication error when connecting to MySQL 8.0+ from Node.js. This happens because MySQL 8.0+ uses a newer authentication method by default (caching_sha2_password) that is not supported by the Node.js mysql driver.

## Solution

### Option 1: Change Authentication Method (Recommended)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open a new SQL tab
4. Execute the following SQL commands:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '#Pranay686';
FLUSH PRIVILEGES;
```

This changes the authentication plugin for the root user to one that's compatible with the Node.js driver.

### Option 2: Update the Connection in server.js

If you can't modify the MySQL authentication method, you can use mysql2 instead, which supports the newer authentication method:

1. Install mysql2:
```
npm uninstall mysql
npm install mysql2
```

2. Modify server.js to use mysql2:
```javascript
const mysql = require('mysql2');
```

## Testing the Connection

After making either of these changes, restart your Node.js server:

```
node server.js
```

The error should be resolved and your server should connect to MySQL successfully. 