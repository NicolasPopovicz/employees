DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees
    WITH TEMPLATE template0
        ENCODING 'UTF8'
        LC_COLLATE 'pt_BR.UTF-8'
        LC_CTYPE   'pt_BR.UTF-8';

DROP SEQUENCE IF EXISTS document_id_seq CASCADE;
DROP SEQUENCE IF EXISTS document_type_id_seq CASCADE;
DROP SEQUENCE IF EXISTS employee_id_seq CASCADE;

DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS documenttype CASCADE;
DROP TABLE IF EXISTS document_type CASCADE;
DROP TABLE IF EXISTS document CASCADE;

DROP TYPE IF EXISTS document_status CASCADE;
DROP TYPE IF EXISTS document_status_enum CASCADE;

CREATE TYPE document_status AS ENUM ('ENVIADO', 'PENDENTE');

CREATE TABLE employee (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    document       VARCHAR(14),
    hiredat        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE
);

CREATE TABLE documenttype (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100) UNIQUE
);

CREATE TABLE document (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    status         document_status NOT NULL,
    idemployee     INTEGER REFERENCES employee(id),
    iddocumenttype INTEGER REFERENCES documenttype(id)
);