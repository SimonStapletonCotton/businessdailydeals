-- Business Daily Deals Database Schema
-- MySQL Version (Production Ready)

CREATE DATABASE IF NOT EXISTS businessdailydeals;
USE businessdailydeals;

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('buyer', 'supplier') NOT NULL,
    credits INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals table  
CREATE TABLE deals (
    id VARCHAR(255) PRIMARY KEY,
    supplier_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    price DECIMAL(10,2),
    deal_type ENUM('hot', 'regular') DEFAULT 'regular',
    image_url TEXT,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES users(id)
);

-- Keywords table
CREATE TABLE keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    deal_id VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (deal_id) REFERENCES deals(id)
);

-- Sample data for immediate functionality
INSERT INTO deals (id, supplier_id, title, description, category, price, deal_type, image_url, is_active) VALUES
('prod-sync-1', '46102542', 'Premium Office Furniture Set', 'Complete office setup with desk, chair, and storage solutions', 'Office Supplies', 2500.00, 'hot', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', TRUE),
('prod-sync-2', '46102542', 'Industrial Safety Equipment Bundle', 'Comprehensive safety gear for construction and manufacturing', 'Safety Equipment', 1800.00, 'hot', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837', TRUE);

-- Ready for February 20, 2026 promotional launch!