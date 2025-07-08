-- Grind Factory Gym Database Setup

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gym_database;
USE gym_database;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    payment_status VARCHAR(20) DEFAULT 'Pending',
    service_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    bio TEXT,
    image_url VARCHAR(255),
    video_url VARCHAR(255)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration VARCHAR(50)
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    message TEXT,
    date_submitted DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    trainer_id INT,
    max_capacity INT DEFAULT 20,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL
);

-- Insert sample trainers
INSERT INTO trainers (name, specialization, bio, image_url, video_url) VALUES
('Chris Bumstead', 'Bodybuilding', 'Four-time Mr. Olympia Classic Physique champion. Known for his aesthetic physique and rigorous training regimen.', 'images/cbum.jpg', 'videos/cbum_training.mp4'),
('Ramon Dino', 'Classic Physique', 'Professional bodybuilder and fitness influencer. Known for his symmetrical physique and detailed muscle development.', 'images/ramon.jpg', 'videos/ramon_training.mp4'),
('Sarah Johnson', 'Strength Training', 'Certified personal trainer with 10 years of experience in strength and conditioning. Specializes in powerlifting techniques.', 'images/sarah.jpg', 'videos/sarah_training.mp4'),
('Mike Peters', 'Functional Fitness', 'CrossFit Level 3 trainer with expertise in mobility work and functional movement patterns.', 'images/mike.jpg', 'videos/mike_training.mp4'),
('Lisa Chen', 'Yoga & Flexibility', 'Yoga instructor with specialization in flexibility training for athletes and bodybuilders.', 'images/lisa.jpg', 'videos/lisa_training.mp4');

-- Insert sample services
INSERT INTO services (title, description, price, duration) VALUES
('One-on-One Training', 'Personalized training sessions tailored to your specific goals with our expert trainers.', 1500.00, '60 minutes'),
('Group Fitness Classes', 'High-energy group workouts led by certified instructors. Includes HIIT, cardio, and strength training.', 800.00, '45 minutes'),
('Nutrition Consultation', 'Comprehensive nutrition plan designed by our certified nutritionists to complement your fitness regime.', 2000.00, '90 minutes'),
('Body Composition Analysis', 'Detailed analysis of body fat percentage, muscle mass, and metabolic rate using advanced equipment.', 500.00, '30 minutes'),
('Recovery Session', 'Professional recovery techniques including massage therapy, stretching, and mobility work.', 1200.00, '60 minutes');

-- Insert sample schedule
INSERT INTO schedule (day_of_week, start_time, end_time, class_name, trainer_id, max_capacity) VALUES
('Monday', '06:00:00', '07:00:00', 'Morning Strength', 1, 15),
('Monday', '08:00:00', '09:00:00', 'Cardio Blast', 3, 20),
('Monday', '18:00:00', '19:30:00', 'Evening Bodybuilding', 2, 12),
('Tuesday', '07:00:00', '08:00:00', 'Functional Fitness', 4, 15),
('Tuesday', '09:00:00', '10:00:00', 'Flexibility & Mobility', 5, 20),
('Tuesday', '17:00:00', '18:00:00', 'HIIT Training', 3, 25),
('Wednesday', '06:00:00', '07:00:00', 'Morning Strength', 1, 15),
('Wednesday', '12:00:00', '13:00:00', 'Lunchtime Express', 4, 10),
('Wednesday', '19:00:00', '20:00:00', 'Evening Yoga', 5, 20),
('Thursday', '08:00:00', '09:00:00', 'Classic Physique', 2, 15),
('Thursday', '17:30:00', '18:30:00', 'Conditioning Circuit', 3, 20),
('Friday', '06:00:00', '07:00:00', 'Morning Strength', 1, 15),
('Friday', '10:00:00', '11:00:00', 'Mobility & Recovery', 5, 20),
('Friday', '18:00:00', '19:30:00', 'Evening Bodybuilding', 2, 12),
('Saturday', '09:00:00', '10:30:00', 'Weekend Warrior', 4, 25),
('Saturday', '11:00:00', '12:00:00', 'Yoga Flow', 5, 20),
('Sunday', '10:00:00', '11:00:00', 'Sunday Stretch', 5, 25);

-- Create an admin user
INSERT INTO users (name, email, password, is_admin)
VALUES ('Admin User', 'admin@grindfactory.com', 'admin123', TRUE);

SELECT * FROM users ORDER BY registration_date DESC;

SELECT m.id, u.name, u.email, m.plan_type, m.start_date, m.end_date, m.status 
FROM memberships m 
JOIN users u ON m.user_id = u.id 
WHERE m.status = 'Active' 
ORDER BY m.end_date;

SELECT * FROM trainers;

SELECT u.name, u.email, m.plan_type, m.payment_status, m.start_date 
FROM memberships m 
JOIN users u ON m.user_id = u.id 
WHERE m.payment_status = 'Pending'; 