-- ======================================================================
-- PostgreSQL Functions & Views
-- Author: Omkar Bhutale
-- Description: Complete schema-aligned functions & views for data layer
-- ======================================================================

-- ========================
-- FUNCTIONS / PROCEDURES
-- ========================

-- 1. Function: Add User with Role
CREATE OR REPLACE FUNCTION sp_add_user_with_role(
    p_user_id VARCHAR,
    p_name VARCHAR,
    p_email VARCHAR,
    p_role_name VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_role_id INT;
BEGIN
    -- Insert new user
    INSERT INTO users (user_id, name, email, created_at)
    VALUES (p_user_id, p_name, p_email, NOW());

    -- Find role ID
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = p_role_name;

    -- If found, assign
    IF v_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (p_user_id, v_role_id);
    ELSE
        RAISE EXCEPTION 'Role "%" not found.', p_role_name;
    END IF;

    RETURN p_user_id;
END;
$$ LANGUAGE plpgsql;



-- 2. Function: Add Topic to Course
CREATE OR REPLACE FUNCTION sp_add_topic_to_course(
    p_title VARCHAR,
    p_content JSONB,
    p_creator_id VARCHAR,
    p_course_id INT
) RETURNS INT AS $$
DECLARE
    v_topic_id INT;
    v_index INT;
BEGIN
    -- Insert new topic
    INSERT INTO topics (title, content, creator_id, created_at)
    VALUES (p_title, p_content, p_creator_id, NOW())
    RETURNING topic_id INTO v_topic_id;

    -- Determine next index
    SELECT COALESCE(MAX(index_value), 0) + 1 INTO v_index
    FROM course_topic_info
    WHERE course_id = p_course_id;

    -- Link topic to course
    INSERT INTO course_topic_info (course_id, topic_id, index_value, topic_status)
    VALUES (p_course_id, v_topic_id, v_index, TRUE);

    RETURN v_topic_id;
END;
$$ LANGUAGE plpgsql;



-- 3. Function: Add MCQ
CREATE OR REPLACE FUNCTION sp_add_mcq(
    p_question TEXT,
    p_options JSONB,
    p_topic_id INT
) RETURNS INT AS $$
DECLARE
    v_mcq_id INT;
BEGIN
    INSERT INTO mcqs (question, options, topic_id)
    VALUES (p_question, p_options, p_topic_id)
    RETURNING mcq_id INTO v_mcq_id;

    RETURN v_mcq_id;
END;
$$ LANGUAGE plpgsql;



-- 4. Function: Add Problem
CREATE OR REPLACE FUNCTION sp_add_problem(
    p_title VARCHAR,
    p_description TEXT,
    p_difficulty difficulty_level,
    p_topic_id INT
) RETURNS INT AS $$
DECLARE
    v_problem_id INT;
BEGIN
    INSERT INTO problems (title, description, difficulty, topic_id)
    VALUES (p_title, p_description, p_difficulty, p_topic_id)
    RETURNING problem_id INTO v_problem_id;

    RETURN v_problem_id;
END;
$$ LANGUAGE plpgsql;



-- ========================
-- VIEWS
-- ========================

-- 1. View: Users with Roles
CREATE OR REPLACE VIEW vw_users_with_roles AS
SELECT
    u.user_id,
    u.name,
    u.email,
    array_agg(r.role_name) AS roles
FROM
    users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
GROUP BY
    u.user_id, u.name, u.email;



-- 2. View: Latest Problem Submissions
CREATE OR REPLACE VIEW vw_latest_problem_submissions AS
SELECT DISTINCT ON (user_id, problem_id)
    submission_id,
    user_id,
    problem_id,
    language,
    code,
    status,
    submitted_at
FROM
    problem_submissions
ORDER BY
    user_id, problem_id, submitted_at DESC;



-- 3. View: Problem Details
CREATE OR REPLACE VIEW vw_problem_details AS
SELECT
    p.problem_id,
    p.title AS problem_title,
    p.description,
    p.difficulty,
    t.topic_id,
    t.title AS topic_title,
    cti.course_id,
    c.title AS course_title
FROM
    problems p
JOIN topics t ON p.topic_id = t.topic_id
LEFT JOIN course_topic_info cti ON t.topic_id = cti.topic_id
LEFT JOIN courses c ON cti.course_id = c.course_id;



-- 4. View: Course Summary
CREATE OR REPLACE VIEW vw_course_summary AS
SELECT
    c.course_id,
    c.title,
    c.description,
    COUNT(DISTINCT cti.topic_id) AS topic_count,
    COUNT(DISTINCT bca.batch_id) AS assigned_batch_count
FROM
    courses c
LEFT JOIN course_topic_info cti ON c.course_id = cti.course_id
LEFT JOIN batch_course_assignments bca ON c.course_id = bca.course_id
GROUP BY
    c.course_id, c.title, c.description;



-- 5. View: User Profile
CREATE OR REPLACE VIEW vw_user_profile AS
SELECT
    u.user_id,
    u.name,
    u.email,
    b.batch_id,
    b.batch_name,
    array_agg(DISTINCT r.role_name) AS roles
FROM
    users u
LEFT JOIN user_batch_assignments uba ON u.user_id = uba.user_id
LEFT JOIN batches b ON uba.batch_id = b.batch_id
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
GROUP BY
    u.user_id, u.name, u.email, b.batch_id, b.batch_name;

-- ======================================================================
-- END OF FILE
-- ======================================================================
