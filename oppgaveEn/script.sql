-- SQL script for Registreringsskjema

-- Opprett databasen
DROP DATABASE IF EXISTS Registrering;
CREATE DATABASE IF NOT EXISTS Registrering;
USE Registrering;

-- Opprett tabellen for brukere
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(8) NOT NULL,
    birthDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eksempeldata (valgfritt)
INSERT INTO users (first_name, last_name, email, phone, birth_date) VALUES
('Ola', 'Nordmann', 'ola@nordmann.no', '90000000', '1990-01-01'),
('Kari', 'Nordmann', NULL, '40000000', '2000-05-15');
