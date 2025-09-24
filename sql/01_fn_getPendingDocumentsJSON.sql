DROP FUNCTION IF EXISTS getPendingDocumentsJSON;

CREATE OR REPLACE FUNCTION getPendingDocumentsJSON (
    p_employee_name VARCHAR DEFAULT '',
    p_document_type VARCHAR DEFAULT '',
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
    -- Conta o total
    SELECT COUNT(*) INTO total_records
    FROM (
        SELECT e.id
        FROM employee e
        JOIN document d ON d.idemployee = e.id
        JOIN documenttype dt ON d.iddocumenttype = dt.id
        WHERE d.status = p_status
        AND (p_employee_name = '' OR e.name ILIKE '%' || p_employee_name || '%')
        AND (p_document_type = '' OR dt.name ILIKE '%' || p_document_type || '%')
        GROUP BY e.id
    ) sub;

    total_pages := CEIL(total_records::DECIMAL / p_totalregisters);
    has_next := (p_page < total_pages);

    -- Resultado
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
                WHERE d.idemployee = e.id
                AND d.status = p_status
                AND (p_document_type = '' OR dt.name ILIKE '%' || p_document_type || '%')
            )
        ) AS emp
        FROM employee e
        WHERE EXISTS (
            SELECT 1 FROM document d
            JOIN documenttype dt ON d.iddocumenttype = dt.id
            WHERE d.idemployee = e.id
            AND d.status = p_status
            AND (p_document_type = '' OR dt.name ILIKE '%' || p_document_type || '%')
        )
        AND (p_employee_name = '' OR e.name ILIKE '%' || p_employee_name || '%')
        ORDER BY e.id
        LIMIT p_totalregisters OFFSET ((p_page - 1) * p_totalregisters)
    ) subq;

    RETURN result;
END;
$$ LANGUAGE plpgsql;