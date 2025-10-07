-- ==================================================
-- Custom Type Definitions
-- ==================================================

CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- ==================================================
-- User and Role Management Tables
-- ==================================================

CREATE TABLE roles (
    role_id   INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR(255) NOT NULL,
    CONSTRAINT uk_roles_role_name UNIQUE (role_name)
);

CREATE TABLE users (
    user_id    VARCHAR(255) NOT NULL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ(6) NULL,
    insights   JSONB        NULL,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_name UNIQUE (name) -- As generated in your logs
);

CREATE TABLE user_roles (
    role_id INTEGER      NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id, user_id),
    CONSTRAINT fk_user_roles_roles FOREIGN KEY (role_id) REFERENCES roles (role_id),
    CONSTRAINT fk_user_roles_users FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- ==================================================
-- Batch and Course Management Tables
-- ==================================================

CREATE TABLE batches (
    batch_id   INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    batch_name VARCHAR(255) NOT NULL,
    start_date TIMESTAMPTZ(6) NULL,
    end_date   TIMESTAMPTZ(6) NULL
);

CREATE TABLE courses (
    course_id   INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NULL,
    creator_id  VARCHAR(255) NULL,
    created_at  TIMESTAMPTZ(6) NULL,
    CONSTRAINT fk_courses_users FOREIGN KEY (creator_id) REFERENCES users (user_id)
);

CREATE TABLE batch_course_assignments (
    batch_id  INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    PRIMARY KEY (batch_id, course_id),
    CONSTRAINT fk_bca_batches FOREIGN KEY (batch_id) REFERENCES batches (batch_id),
    CONSTRAINT fk_bca_courses FOREIGN KEY (course_id) REFERENCES courses (course_id)
);

CREATE TABLE user_batch_assignments (
    user_id  VARCHAR(255) NOT NULL,
    batch_id INTEGER      NOT NULL,
    PRIMARY KEY (user_id, batch_id),
    CONSTRAINT fk_uba_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_uba_batches FOREIGN KEY (batch_id) REFERENCES batches (batch_id)
);

-- ==================================================
-- Content and Assessment Tables
-- ==================================================

CREATE TABLE topics (
    topic_id   INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title      VARCHAR(255) NOT NULL,
    content    JSONB        NOT NULL,
    creator_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT fk_topics_users FOREIGN KEY (creator_id) REFERENCES users (user_id)
);

CREATE TABLE course_topic_info (
    course_id    INTEGER NOT NULL,
    topic_id     INTEGER NOT NULL,
    index_value  INTEGER NULL,
    topic_status BOOLEAN NULL,
    PRIMARY KEY (course_id, topic_id),
    CONSTRAINT fk_cti_courses FOREIGN KEY (course_id) REFERENCES courses (course_id),
    CONSTRAINT fk_cti_topics FOREIGN KEY (topic_id) REFERENCES topics (topic_id)
);

CREATE TABLE problems (
    problem_id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title       VARCHAR(255)   NULL,
    description TEXT           NOT NULL,
    difficulty  difficulty_level NOT NULL,
    topic_id    INTEGER        NOT NULL,
    CONSTRAINT fk_problems_topics FOREIGN KEY (topic_id) REFERENCES topics (topic_id)
);

CREATE TABLE problem_test_cases (
    test_case_id    INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    problem_id      INTEGER NOT NULL,
    input           TEXT    NULL,
    expected_output TEXT    NULL,
    is_public       BOOLEAN NOT NULL,
    CONSTRAINT fk_test_cases_problems FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
);

CREATE TABLE mcqs (
    mcq_id   INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    question TEXT  NOT NULL,
    options  JSONB NOT NULL,
    topic_id INTEGER NOT NULL,
    CONSTRAINT fk_mcqs_topics FOREIGN KEY (topic_id) REFERENCES topics (topic_id)
);

-- ==================================================
-- User Activity and Submission Tables
-- ==================================================

CREATE TABLE mcq_attempts (
    attempt_id      INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id         VARCHAR(255) NOT NULL,
    mcq_id          INTEGER      NOT NULL,
    selected_option VARCHAR(255) NOT NULL,
    is_correct      BOOLEAN      NOT NULL,
    attempted_at    TIMESTAMPTZ(6) NULL,
    CONSTRAINT fk_mcq_attempts_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_mcq_attempts_mcqs FOREIGN KEY (mcq_id) REFERENCES mcqs (mcq_id)
);

CREATE TABLE user_problem_reports (
    user_problem_report_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id                VARCHAR(255) NOT NULL,
    problem_id             INTEGER      NOT NULL,
    is_solved              BOOLEAN      NOT NULL,
    total_attempts         INTEGER      NOT NULL,
    languages_used         JSONB        NOT NULL,
    insights               JSONB        NOT NULL, -- Renamed from 'insight' for clarity
    CONSTRAINT uk_user_problem_reports_user_problem UNIQUE (user_id, problem_id),
    CONSTRAINT fk_upr_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_upr_problems FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
);

CREATE TABLE problem_submissions (
    submission_id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id                VARCHAR(255) NOT NULL,
    problem_id             INTEGER      NOT NULL,
    user_problem_report_id INTEGER      NOT NULL,
    language               VARCHAR(255) NOT NULL,
    code                   TEXT         NOT NULL,
    status                 VARCHAR(50)  NOT NULL, -- Changed from is_solved for more detail
    submitted_at           TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT fk_submissions_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_submissions_problems FOREIGN KEY (problem_id) REFERENCES problems (problem_id),
    CONSTRAINT fk_submissions_upr FOREIGN KEY (user_problem_report_id) REFERENCES user_problem_reports (user_problem_report_id)
);

CREATE TABLE pseudocode_submissions (
    pseudocode_submission_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id                  VARCHAR(255) NOT NULL,
    problem_id               INTEGER      NOT NULL,
    content                  TEXT         NULL,
    feedback                 TEXT         NULL,
    version                  INTEGER      NOT NULL,
    is_correct               BOOLEAN      NOT NULL,
    CONSTRAINT fk_pseudo_submissions_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_pseudo_submissions_problems FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
);

CREATE TABLE algorithm_submissions (
    algorithm_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id      VARCHAR(255) NOT NULL,
    problem_id   INTEGER      NOT NULL,
    content      TEXT         NOT NULL,
    feedback     TEXT         NULL,
    version      INTEGER      NOT NULL,
    is_correct   BOOLEAN      NOT NULL,
    CONSTRAINT fk_algo_submissions_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_algo_submissions_problems FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
);

-- ==================================================
-- User Engagement and Analytics Tables
-- ==================================================

CREATE TABLE user_topic_engagement (
    user_id             VARCHAR(255) NOT NULL,
    topic_id            INTEGER      NOT NULL,
    total_seconds_spent INTEGER      NOT NULL,
    last_activity_at    TIMESTAMPTZ(6) NOT NULL,
    is_completed        BOOLEAN      NOT NULL,
    PRIMARY KEY (user_id, topic_id),
    CONSTRAINT fk_ute_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_ute_topics FOREIGN KEY (topic_id) REFERENCES topics (topic_id)
);

CREATE TABLE user_problem_engagement (
    user_id             VARCHAR(255) NOT NULL,
    problem_id          INTEGER      NOT NULL,
    total_seconds_spent INTEGER      NOT NULL,
    total_attempts      INTEGER      NOT NULL,
    last_activity_at    TIMESTAMPTZ(6) NOT NULL,
    is_solved           BOOLEAN      NOT NULL, -- Added based on your logs
    PRIMARY KEY (user_id, problem_id),
    CONSTRAINT fk_upe_users FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_upe_problems FOREIGN KEY (problem_id) REFERENCES problems (problem_id)
);