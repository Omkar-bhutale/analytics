-- ==========================================
-- INSERT realistic test cases for problems
-- ==========================================

-- Problem 1: Check Even or Odd
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 1, '4', 'Even'),
(true, 1, '7', 'Odd'),
(false, 1, '0', 'Even'),
(false, 1, '15', 'Odd');

-- Problem 2: Find Largest of Three Numbers
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 2, '4 8 2', '8'),
(true, 2, '10 5 3', '10'),
(false, 2, '12 45 33', '45'),
(false, 2, '7 7 7', '7');

-- Problem 3: Sum of First N Natural Numbers
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 3, '5', '15'),
(true, 3, '10', '55'),
(false, 3, '1', '1'),
(false, 3, '20', '210');

-- Problem 4: Check Positive or Negative
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 4, '-4', 'Negative'),
(true, 4, '7', 'Positive'),
(false, 4, '0', 'Zero'),
(false, 4, '-100', 'Negative');

-- Problem 5: Find Grade Based on Marks
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 5, '85', 'A'),
(true, 5, '72', 'B'),
(false, 5, '55', 'C'),
(false, 5, '40', 'D');

-- Problem 6: Check Leap Year
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 6, '2020', 'Leap Year'),
(true, 6, '2021', 'Not Leap Year'),
(false, 6, '2000', 'Leap Year'),
(false, 6, '1900', 'Not Leap Year');

-- Problem 7: Print Multiplication Table
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 7, '2', '2 4 6 8 10 12 14 16 18 20'),
(true, 7, '3', '3 6 9 12 15 18 21 24 27 30'),
(false, 7, '5', '5 10 15 20 25 30 35 40 45 50'),
(false, 7, '10', '10 20 30 40 50 60 70 80 90 100');

-- Problem 8: Factorial of a Number
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 8, '5', '120'),
(true, 8, '3', '6'),
(false, 8, '0', '1'),
(false, 8, '6', '720');

-- Problem 9: Sum of Digits
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 9, '123', '6'),
(true, 9, '456', '15'),
(false, 9, '9999', '36'),
(false, 9, '1001', '2');

-- Problem 10: Reverse a Number
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 10, '123', '321'),
(true, 10, '400', '004'),
(false, 10, '9876', '6789'),
(false, 10, '100', '001');

-- Problem 11: Count Vowels in String
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 11, 'hello', '2'),
(true, 11, 'world', '1'),
(false, 11, 'education', '5'),
(false, 11, 'bcd', '0');

-- Problem 12: Check Palindrome
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 12, 'madam', 'Palindrome'),
(true, 12, 'hello', 'Not Palindrome'),
(false, 12, 'racecar', 'Palindrome'),
(false, 12, 'java', 'Not Palindrome');

-- Problem 13: Find Smallest Element in Array
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 13, '3 1 4 2', '1'),
(true, 13, '10 5 7', '5'),
(false, 13, '9 9 9', '9'),
(false, 13, '20 15 30 5', '5');

-- Problem 14: Count Even Numbers in Array
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 14, '1 2 3 4 5', '2'),
(true, 14, '2 4 6 8', '4'),
(false, 14, '1 3 5 7', '0'),
(false, 14, '10 12 13 14', '3');

-- Problem 15: Find Fibonacci Series up to N
INSERT INTO public.problem_test_cases (is_public, problem_id, input, expected_output) VALUES
(true, 15, '5', '0 1 1 2 3'),
(true, 15, '7', '0 1 1 2 3 5 8'),
(false, 15, '3', '0 1 1'),
(false, 15, '1', '0');
