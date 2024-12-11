DROP DATABASE oppgaveEn;

CREATE DATABASE oppgaveEn;

USE oppgaveEn;

CREATE TABLE Brukerdata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fornavn VARCHAR(50) NOT NULL,
    etternavn VARCHAR(50) NOT NULL,
    epost VARCHAR(100),
    telefon VARCHAR(50) NOT NULL,
    fodselsdato DATE NOT NULL,
    opprettet TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);