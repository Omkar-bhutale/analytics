-- =========================
-- 1. ROLES
-- =========================
INSERT INTO roles (role_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'SME'),
(3, 'TRAINEE');

-- =========================
-- 2. USERS
-- =========================
INSERT INTO users (user_id, name, email, created_at, insights) VALUES
('U001', 'Alice Johnson', 'alice@example.com', NOW(), '{}'),
('U002', 'Bob Smith', 'bob@example.com', NOW(), '{}'),
('U003', 'Charlie Brown', 'charlie@example.com', NOW(), '{}'),
('U004', 'Diana Prince', 'diana@example.com', NOW(), '{}'),
('U005', 'Ethan Clark', 'ethan@example.com', NOW(), '{}'),
('U006', 'Fiona Adams', 'fiona@example.com', NOW(), '{}'),
('U007', 'George Harris', 'george@example.com', NOW(), '{}'),
('U008', 'Hannah White', 'hannah@example.com', NOW(), '{}'),
('U009', 'Ian Roberts', 'ian@example.com', NOW(), '{}'),
('U010', 'Julia Evans', 'julia@example.com', NOW(), '{}'),
('U011', 'Kevin Lewis', 'kevin@example.com', NOW(), '{}'),
('U012', 'Laura Hall', 'laura@example.com', NOW(), '{}'),
('U013', 'Mark Turner', 'mark@example.com', NOW(), '{}'),
('U014', 'Nina Scott', 'nina@example.com', NOW(), '{}'),
('U015', 'Oscar Young', 'oscar@example.com', NOW(), '{}');

-- =========================
-- 3. USER_ROLES
-- =========================
INSERT INTO user_roles (role_id, user_id) VALUES
(1, 'U001'), (1, 'U002'),
(2, 'U003'), (2, 'U004'), (2, 'U005'),
(3, 'U006'), (3, 'U007'), (3, 'U008'),
(3, 'U009'), (3, 'U010'), (3, 'U011'),
(3, 'U012'), (3, 'U013'), (3, 'U014'), (3, 'U015');

-- =========================
-- 4. c
-- =========================
INSERT INTO batches (batch_id, batch_name, start_date, end_date) VALUES
(1, 'Batch 44', '2025-01-01', '2025-12-31');

-- =========================
-- 5. USER_BATCH_ASSIGNMENTS
-- =========================
INSERT INTO user_batch_assignments (batch_id, user_id) VALUES
(1, 'U006'), (1, 'U007'), (1, 'U008'), (1, 'U009'),
(1, 'U010'), (1, 'U011'), (1, 'U012'), (1, 'U013'),
(1, 'U014'), (1, 'U015');

-- =========================
-- 6. COURSES
-- =========================
INSERT INTO courses (course_id, title, description, creator_id, created_at) VALUES
(1, 'JAVA', 'Java Programming Basics and OOP', 'U001', NOW()),
(2, 'PYTHON', 'Python for Beginners', 'U002', NOW()),
(3, 'JAVASCRIPT', 'Frontend Logic with JS', 'U003', NOW()),
(4, 'TYPESCRIPT', 'Strongly Typed JS Programming', 'U004', NOW());

-- =========================
-- 7. MAIN_TOPICS
-- =========================
INSERT INTO main_topics (main_topic_id, title, description, creator_id, created_at) VALUES
(1, 'Basic Data Types', 'Covers primitive and reference data types', 'U001', NOW()),
(2, 'Conditional Statements', 'Covers if-else, switch-case statements', 'U001', NOW()),
(3, 'Looping Constructs', 'Covers for, while, do-while loops', 'U001', NOW()),
(4, 'Functions & Methods', 'Covers defining and using functions', 'U001', NOW());

-- =========================
-- 8. TOPICS (Entry Level)
-- =========================
INSERT INTO topics (topic_id, title, creator_id, main_topic_id, created_at, content) VALUES
(1, 'Integer', 'U001', 1, NOW(), '{"type":"primitive"}'),
(2, 'Float', 'U001', 1, NOW(), '{"type":"primitive"}'),
(3, 'String', 'U001', 1, NOW(), '{"type":"reference"}'),
(4, 'Boolean', 'U001', 1, NOW(), '{"type":"primitive"}'),
(5, 'If-Else', 'U001', 2, NOW(), '{"example":"simple condition"}'),
(6, 'Switch', 'U001', 2, NOW(), '{"example":"multi-choice"}'),
(7, 'Nested Conditions', 'U001', 2, NOW(), '{"example":"complex branching"}'),
(8, 'For Loop', 'U001', 3, NOW(), '{"example":"iteration"}'),
(9, 'While Loop', 'U001', 3, NOW(), '{"example":"repetition"}'),
(10, 'Do-While Loop', 'U001', 3, NOW(), '{"example":"post-check"}'),
(11, 'Function Declaration', 'U001', 4, NOW(), '{"syntax":"void add()"}'),
(12, 'Return Values', 'U001', 4, NOW(), '{"syntax":"return value"}');

-- =========================
-- 9. PROBLEMS
-- =========================
INSERT INTO problems (problem_id, topic_id, title, description, difficulty) VALUES
(1, 1, 'Sum of Integers', 'Add two integers from user input', 'EASY'),
(2, 2, 'Average of Floats', 'Calculate average of float numbers', 'EASY'),
(3, 3, 'String Concatenation', 'Join two strings together', 'EASY'),
(4, 4, 'Boolean Logic', 'Check if a condition is true or false', 'EASY'),
(5, 5, 'Simple If-Else', 'Use if-else to compare two numbers', 'EASY'),
(6, 6, 'Switch Example', 'Use switch to print day of week', 'MEDIUM'),
(7, 7, 'Nested Conditions', 'Handle multiple conditions', 'MEDIUM'),
(8, 8, 'Sum of First N Numbers', 'Use for loop to calculate sum', 'EASY'),
(9, 9, 'Factorial with While Loop', 'Compute factorial', 'MEDIUM'),
(10, 10, 'Menu with Do-While', 'Repeat until exit condition', 'MEDIUM'),
(11, 11, 'Simple Function', 'Write and call a function', 'EASY'),
(12, 12, 'Return Max Value', 'Function returns maximum number', 'EASY'),
(13, 1, 'Type Conversion', 'Convert string to integer', 'MEDIUM'),
(14, 3, 'String Length', 'Find length of a string', 'EASY'),
(15, 8, 'Even Numbers Loop', 'Print even numbers till N', 'EASY');

-- =========================
-- 10. USER_TOPIC_ENGAGEMENT
-- =========================
INSERT INTO user_topic_engagement (topic_id, user_id, is_completed, total_seconds_spent, last_activity_at) VALUES
(1, 'U006', true, 120, NOW()),
(2, 'U007', true, 150, NOW()),
(3, 'U008', false, 200, NOW()),
(4, 'U009', true, 300, NOW()),
(5, 'U010', false, 400, NOW()),
(6, 'U011', true, 500, NOW()),
(7, 'U012', true, 250, NOW()),
(8, 'U013', false, 320, NOW()),
(9, 'U014', true, 210, NOW()),
(10, 'U015', true, 190, NOW()),
(11, 'U006', true, 130, NOW()),
(12, 'U007', true, 180, NOW()),
(8, 'U008', false, 160, NOW()),
(9, 'U009', true, 300, NOW()),
(10, 'U010', false, 90, NOW());

-- =========================
-- 11. USER_PROBLEM_REPORTS
-- =========================
INSERT INTO user_problem_reports (user_problem_report_id, problem_id, user_id, is_solved, total_attempts, insights, languages_used) VALUES
(1, 1, 'U006', true, 1, '{"hint":"use scanner"}', '["JAVA"]'),
(2, 2, 'U007', true, 2, '{"hint":"loop through values"}', '["PYTHON"]'),
(3, 3, 'U008', false, 3, '{"hint":"use + operator"}', '["JAVA"]'),
(4, 4, 'U009', true, 1, '{"hint":"boolean expression"}', '["JAVA"]'),
(5, 5, 'U010', false, 2, '{"hint":"simple comparison"}', '["PYTHON"]'),
(6, 6, 'U011', true, 2, '{"hint":"switch syntax"}', '["JAVA"]'),
(7, 7, 'U012', true, 1, '{"hint":"nested if"}', '["PYTHON"]'),
(8, 8, 'U013', true, 2, '{"hint":"for loop sum"}', '["JAVA"]'),
(9, 9, 'U014', true, 2, '{"hint":"factorial logic"}', '["JAVA"]'),
(10, 10, 'U015', false, 3, '{"hint":"while condition"}', '["PYTHON"]'),
(11, 11, 'U006', true, 1, '{"hint":"define function"}', '["JAVA"]'),
(12, 12, 'U007', true, 1, '{"hint":"return keyword"}', '["PYTHON"]'),
(13, 13, 'U008', false, 2, '{"hint":"parseInt"}', '["JAVA"]'),
(14, 14, 'U009', true, 2, '{"hint":"string length"}', '["JAVA"]'),
(15, 15, 'U010', true, 1, '{"hint":"modulus"}', '["JAVA"]');

-- =========================
-- 12. PROBLEM_SUBMISSIONS
-- =========================
INSERT INTO problem_submissions (submission_id, problem_id, user_problem_report_id, user_id, code, language, submitted_at, is_solved) VALUES
(1, 1, 1, 'U006', 'System.out.println(a+b);', 'JAVA', NOW(), 'true'),
(2, 2, 2, 'U007', 'sum/len', 'PYTHON', NOW(), 'true'),
(3, 3, 3, 'U008', '"hello"+"world"', 'JAVA', NOW(), 'false'),
(4, 4, 4, 'U009', 'if(true){...}', 'JAVA', NOW(), 'true'),
(5, 5, 5, 'U010', 'if(a>b)...', 'PYTHON', NOW(), 'false'),
(6, 6, 6, 'U011', 'switch(day){...}', 'JAVA', NOW(), 'true'),
(7, 7, 7, 'U012', 'if(x>y)...', 'PYTHON', NOW(), 'true'),
(8, 8, 8, 'U013', 'for(int i=0;i<n;i++)...', 'JAVA', NOW(), 'true'),
(9, 9, 9, 'U014', 'while(n>0)...', 'JAVA', NOW(), 'true'),
(10, 10, 10, 'U015', 'do{...}while();', 'PYTHON', NOW(), 'false'),
(11, 11, 11, 'U006', 'void greet(){}', 'JAVA', NOW(), 'true'),
(12, 12, 12, 'U007', 'return max(a,b);', 'PYTHON', NOW(), 'true'),
(13, 13, 13, 'U008', 'Integer.parseInt()', 'JAVA', NOW(), 'false'),
(14, 14, 14, 'U009', 'str.length()', 'JAVA', NOW(), 'true'),
(15, 15, 15, 'U010', 'for(i%2==0)...', 'JAVA', NOW(), 'true');

-- =========================
-- 13. USER_PROBLEM_ENGAGEMENT
-- =========================
INSERT INTO user_problem_engagement (problem_id, user_id, is_solved, total_attempts, total_seconds_spent, last_activity_at) VALUES
(1, 'U006', true, 1, 120, NOW()),
(2, 'U007', true, 2, 130, NOW()),
(3, 'U008', false, 3, 250, NOW()),
(4, 'U009', true, 2, 210, NOW()),
(5, 'U010', false, 3, 180, NOW()),
(6, 'U011', true, 1, 150, NOW()),
(7, 'U012', true, 1, 160, NOW()),
(8, 'U013', true, 2, 140, NOW()),
(9, 'U014', true, 1, 200, NOW()),
(10, 'U015', false, 3, 300, NOW()),
(11, 'U006', true, 1, 100, NOW()),
(12, 'U007', true, 1, 130, NOW()),
(13, 'U008', false, 3, 230, NOW()),
(14, 'U009', true, 2, 150, NOW()),
(15, 'U010', true, 1, 90, NOW());

-- =========================
-- 14. ALGORITHM_SUBMISSIONS
-- =========================
INSERT INTO algorithm_submissions (algorithm_id, problem_id, user_id, version, is_correct, content, feedback) VALUES
(1, 1, 'U006', 1, true, 'sum two numbers', 'Good job'),
(2, 2, 'U007', 1, true, 'average logic', 'Perfect'),
(3, 3, 'U008', 1, false, 'wrong concat', 'Use + operator'),
(4, 4, 'U009', 1, true, 'boolean logic', 'Nice'),
(5, 5, 'U010', 1, false, 'missed else', 'Add else part'),
(6, 6, 'U011', 1, true, 'switch example', 'Clean'),
(7, 7, 'U012', 1, true, 'nested', 'Works fine'),
(8, 8, 'U013', 1, true, 'loop sum', 'Efficient'),
(9, 9, 'U014', 1, true, 'factorial logic', 'Nice recursion'),
(10, 10, 'U015', 1, false, 'missing break', 'Careful with exit'),
(11, 11, 'U006', 1, true, 'function add', 'Neat'),
(12, 12, 'U007', 1, true, 'return value', 'Correct'),
(13, 13, 'U008', 1, false, 'parse error', 'Check conversion'),
(14, 14, 'U009', 1, true, 'length func', 'Fine'),
(15, 15, 'U010', 1, true, 'even loop', 'All good');

-- =========================
-- 15. PSEUDOCODE_SUBMISSIONS
-- =========================
INSERT INTO pseudocode_submissions (pseudocode_submission_id, problem_id, user_id, version, is_correct, content, feedback) VALUES
(1, 1, 'U006', 1, true, 'read a,b -> print a+b', 'Correct'),
(2, 2, 'U007', 1, true, 'sum/len', 'Nice'),
(3, 3, 'U008', 1, false, 'missing return', 'Incomplete'),
(4, 4, 'U009', 1, true, 'if cond', 'Good'),
(5, 5, 'U010', 1, false, 'logic issue', 'Revise'),
(6, 6, 'U011', 1, true, 'switch days', 'Great'),
(7, 7, 'U012', 1, true, 'nested cond', 'Works'),
(8, 8, 'U013', 1, true, 'loop n', 'Perfect'),
(9, 9, 'U014', 1, true, 'while loop', 'Ok'),
(10, 10, 'U015', 1, false, 'infinite loop', 'Fix stop condition'),
(11, 11, 'U006', 1, true, 'def func', 'Good'),
(12, 12, 'U007', 1, true, 'return max', 'Fine'),
(13, 13, 'U008', 1, false, 'syntax issue', 'Wrong format'),
(14, 14, 'U009', 1, true, 'len(s)', 'Fine'),
(15, 15, 'U010', 1, true, 'print even', 'Perfect');
