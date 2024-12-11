
-- Create database
DROP DATABASE IF EXISTS coffeeShop;
CREATE DATABASE IF NOT EXISTS coffeeShop;
USE coffeeShop;

-- Create drinks table
CREATE TABLE IF NOT EXISTS drinks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create add_ons table
CREATE TABLE IF NOT EXISTS addOns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    details TEXT NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO drinks (name, price) VALUES
('Espresso', 25.00),
('Cappuccino', 35.00),
('Latte', 40.00),
('Black Coffee', 20.00);

INSERT INTO addOns (name, price) VALUES
('Sugar', 0.00),
('Ice', 0.00),
('Milk', 5.00),
('Chocolate Syrup', 10.00);

