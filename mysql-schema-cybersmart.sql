-- Business Daily Deals - MySQL 5.7.44 Schema
-- Optimized for Cybersmart Shared Hosting

CREATE DATABASE IF NOT EXISTS businessdailydeals_main;
USE businessdailydeals_main;

-- Users table with MySQL 5.7 compatibility
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('buyer', 'supplier') NOT NULL DEFAULT 'buyer',
    credits INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    vat_number VARCHAR(20) DEFAULT NULL,
    business_registration VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Keywords table
CREATE TABLE keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    deal_id VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Credit transactions table
CREATE TABLE credit_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    transaction_type ENUM('purchase', 'spend', 'refund') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banner ads table
CREATE TABLE banner_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Companies table
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for immediate functionality
INSERT INTO users (id, email, username, role, credits, verified) VALUES
('supplier-demo', 'demo@businessdailydeals.co.za', 'demo_supplier', 'supplier', 100, TRUE);

INSERT INTO deals (id, supplier_id, title, description, category, price, deal_type, image_url, is_active) VALUES
('deal-office-1', 'supplier-demo', 'Premium Office Furniture Set', 'Complete office setup with desk, chair, and storage solutions perfect for modern businesses', 'Office Supplies', 2500.00, 'hot', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', TRUE),
('deal-safety-1', 'supplier-demo', 'Industrial Safety Equipment Bundle', 'Comprehensive safety gear for construction and manufacturing including helmets, vests, and protective equipment', 'Safety Equipment', 1800.00, 'hot', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837', TRUE),
('deal-tech-1', 'supplier-demo', 'Business Computer Package', 'High-performance computers suitable for business operations with warranty and support', 'Technology', 15000.00, 'regular', 'https://images.unsplash.com/photo-1547082299-de196ea013d6', TRUE);

-- Ready for February 20, 2026 promotional launch with FREE deal posting!