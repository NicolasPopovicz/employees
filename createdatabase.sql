CREATE DATABASE employees;

DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS documenttype;
DROP TABLE IF EXISTS document;

DROP TYPE IF EXISTS document_status;

CREATE TYPE document_status AS ENUM ('ENVIADO', 'PENDENTE');

CREATE TABLE employee (
    id             INTEGER PRIMARY KEY NOT NULL,
    name           VARCHAR(150) NOT NULL,
    document       VARCHAR(14),
    hiredAt        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE
);

CREATE TABLE documenttype (
    id             INTEGER PRIMARY KEY NOT NULL,
    name           VARCHAR(100)
);

CREATE TABLE document (
    id             INTEGER PRIMARY KEY NOT NULL,
    name           VARCHAR(50),
    status         document_status NOT NULL,
    employeeId     INTEGER REFERENCES employee(id),
    documentTypeId INTEGER REFERENCES documenttype(id)
);