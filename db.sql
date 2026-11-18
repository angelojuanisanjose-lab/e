create database sermark_db;
CREATE TABLE users (
id INT auto_increment PRIMARY KEY,
name varchar(100) not null,
username Varchar(50) not null unique,
email varchar(100) not null unique,
password varchar(255) not null,
confirm_password varchar(255) null,
created_at timestamp default current_timestamp
);
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    barcode VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    expiry_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CHECK (quantity >= 0),
    INDEX idx_product_expiry (expiry_date)
);
select * From products