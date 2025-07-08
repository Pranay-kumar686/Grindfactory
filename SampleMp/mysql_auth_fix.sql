-- Execute this in MySQL Workbench to fix authentication issues
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '#Pranay686';
FLUSH PRIVILEGES; 