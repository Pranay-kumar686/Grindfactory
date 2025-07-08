-- Stored Procedures for Grind Factory Gym Database

-- User Registration Procedure
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

-- User Login Procedure
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

-- Submit Membership Procedure
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

-- Get Trainers Procedure
DELIMITER //
CREATE PROCEDURE GetTrainers()
BEGIN
    SELECT * FROM trainers ORDER BY id;
END //
DELIMITER ;

-- Get Services Procedure
DELIMITER //
CREATE PROCEDURE GetServices()
BEGIN
    SELECT * FROM services ORDER BY id;
END //
DELIMITER ;

-- Get User Memberships Procedure
DELIMITER //
CREATE PROCEDURE GetUserMemberships(
    IN p_user_id INT
)
BEGIN
    SELECT m.*, s.title AS service_name 
    FROM memberships m
    LEFT JOIN services s ON m.service_id = s.id
    WHERE m.user_id = p_user_id
    ORDER BY m.start_date DESC;
END //
DELIMITER ;

-- Update Membership Status Procedure
DELIMITER //
CREATE PROCEDURE UpdateMembershipStatus(
    IN p_membership_id INT,
    IN p_status VARCHAR(20)
)
BEGIN
    UPDATE memberships 
    SET status = p_status
    WHERE id = p_membership_id;
    
    SELECT ROW_COUNT() AS updated_rows;
END //
DELIMITER ;

-- Update Payment Status Procedure
DELIMITER //
CREATE PROCEDURE UpdatePaymentStatus(
    IN p_membership_id INT,
    IN p_payment_status VARCHAR(20)
)
BEGIN
    UPDATE memberships 
    SET payment_status = p_payment_status
    WHERE id = p_membership_id;
    
    SELECT ROW_COUNT() AS updated_rows;
END //
DELIMITER ;

-- Add Testimonial Procedure
DELIMITER //
CREATE PROCEDURE AddTestimonial(
    IN p_user_id INT,
    IN p_name VARCHAR(100),
    IN p_rating INT,
    IN p_message TEXT
)
BEGIN
    INSERT INTO testimonials (user_id, name, rating, message)
    VALUES (p_user_id, p_name, p_rating, p_message);
    
    SELECT LAST_INSERT_ID() AS testimonial_id;
END //
DELIMITER ;

-- Get Approved Testimonials Procedure
DELIMITER //
CREATE PROCEDURE GetApprovedTestimonials()
BEGIN
    SELECT t.*, u.name AS user_name 
    FROM testimonials t
    LEFT JOIN users u ON t.user_id = u.id
    WHERE t.is_approved = TRUE
    ORDER BY t.date_submitted DESC;
END //
DELIMITER ;

-- Get Schedule Procedure
DELIMITER //
CREATE PROCEDURE GetSchedule(
    IN p_day VARCHAR(20)
)
BEGIN
    IF p_day IS NULL OR p_day = '' THEN
        SELECT s.*, t.name AS trainer_name 
        FROM schedule s
        LEFT JOIN trainers t ON s.trainer_id = t.id
        ORDER BY FIELD(s.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), s.start_time;
    ELSE
        SELECT s.*, t.name AS trainer_name 
        FROM schedule s
        LEFT JOIN trainers t ON s.trainer_id = t.id
        WHERE s.day_of_week = p_day
        ORDER BY s.start_time;
    END IF;
END //
DELIMITER ;

-- Get User Details Procedure
DELIMITER //
CREATE PROCEDURE GetUserDetails(
    IN p_user_id INT
)
BEGIN
    SELECT u.*, 
           COUNT(m.id) AS total_memberships,
           SUM(CASE WHEN m.status = 'Active' THEN 1 ELSE 0 END) AS active_memberships
    FROM users u
    LEFT JOIN memberships m ON u.id = m.user_id
    WHERE u.id = p_user_id
    GROUP BY u.id;
END //
DELIMITER ;

-- Get Active Memberships Report Procedure
DELIMITER //
CREATE PROCEDURE GetActiveMembershipsReport()
BEGIN
    SELECT m.id, u.name, u.email, m.plan_type, m.start_date, m.end_date, m.status, m.payment_status
    FROM memberships m
    JOIN users u ON m.user_id = u.id
    WHERE m.status = 'Active'
    ORDER BY m.end_date;
END //
DELIMITER ;

-- Get Revenue Report Procedure
DELIMITER //
CREATE PROCEDURE GetRevenueReport(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        m.plan_type,
        COUNT(*) AS membership_count,
        CASE 
            WHEN m.plan_type = 'Basic' THEN 999
            WHEN m.plan_type = 'Premium' THEN 1499
            WHEN m.plan_type = 'VIP' THEN 1999
            ELSE 0
        END AS price_per_membership,
        COUNT(*) * 
        CASE 
            WHEN m.plan_type = 'Basic' THEN 999
            WHEN m.plan_type = 'Premium' THEN 1499
            WHEN m.plan_type = 'VIP' THEN 1999
            ELSE 0
        END AS total_revenue
    FROM memberships m
    WHERE m.start_date BETWEEN p_start_date AND p_end_date
    AND m.payment_status = 'Paid'
    GROUP BY m.plan_type
    
    UNION ALL
    
    SELECT 
        'Total' AS plan_type,
        COUNT(*) AS membership_count,
        NULL AS price_per_membership,
        SUM(
            CASE 
                WHEN m.plan_type = 'Basic' THEN 999
                WHEN m.plan_type = 'Premium' THEN 1499
                WHEN m.plan_type = 'VIP' THEN 1999
                ELSE 0
            END
        ) AS total_revenue
    FROM memberships m
    WHERE m.start_date BETWEEN p_start_date AND p_end_date
    AND m.payment_status = 'Paid';
END //
DELIMITER ; 