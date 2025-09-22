DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS documenttype CASCADE;
DROP TABLE IF EXISTS document CASCADE;

DROP TYPE IF EXISTS document_status CASCADE;

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

DROP FUNCTION IF EXISTS getPendingDocumentsJSON;

CREATE OR REPLACE FUNCTION getPendingDocumentsJSON (
    p_status document_status DEFAULT 'PENDENTE',
    p_page INT DEFAULT 1,
    p_totalregisters INT DEFAULT 10
)
RETURNS JSON AS $$
DECLARE
    total_records INT;
    total_pages INT;
    has_next BOOLEAN;
    result JSON;
BEGIN
    SELECT COUNT(*) INTO total_records
    FROM (
        SELECT e.id
        FROM employee e
        JOIN document d ON d.idemployee = e.id
        WHERE d.status = p_status
        GROUP BY e.id
    ) sub;

    total_pages := CEIL(total_records::DECIMAL / p_totalregisters);
    has_next := (p_page < total_pages);

    SELECT JSON_BUILD_OBJECT(
        'currentpage', p_page,
        'totalpages', total_pages,
        'totalrecords', total_records,
        'hasnextpage', has_next,
        'employees', COALESCE(
            JSON_AGG(emp ORDER BY emp->>'employeeid'),
            '[]'::json
        )
    )
    INTO result
    FROM (
        SELECT JSON_BUILD_OBJECT(
            'employeeid', e.id,
            'employeename', e.name,
            'pendingdocuments', (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', d.id,
                        'status', d.status,
                        'name', dt.name
                    ) ORDER BY d.id
                )
                FROM document d
                JOIN documenttype dt ON d.iddocumenttype = dt.id
                WHERE d.idemployee = e.id AND d.status = p_status
            )
        ) AS emp
        FROM employee e
        WHERE EXISTS (
            SELECT 1 FROM document d
            WHERE d.idemployee = e.id AND d.status = p_status
        )
        ORDER BY e.id
        LIMIT p_totalregisters OFFSET ((p_page - 1) * p_totalregisters)
    ) subq;

    RETURN result;
END;
$$ LANGUAGE plpgsql;