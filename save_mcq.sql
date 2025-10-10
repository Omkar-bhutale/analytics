-- =============================
-- Topic 1: Integer
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(1, '{
  "question": "What is the size of int in Java?",
  "options": ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
  "answer": "4 bytes",
  "explanation": "In Java, int is a 32-bit signed data type, i.e., 4 bytes."
}'),
(1, '{
  "question": "Which of these can store the largest integer value?",
  "options": ["byte", "short", "int", "long"],
  "answer": "long",
  "explanation": "The long data type in Java is 64 bits, which stores larger integers than int."
}'),
(1, '{
  "question": "What is the default value of an int variable in Java?",
  "options": ["0", "null", "undefined", "1"],
  "answer": "0",
  "explanation": "All numeric primitives (int, byte, short, long) default to 0 in Java."
}'),
(1, '{
  "question": "Which data type should be used to store a student roll number?",
  "options": ["int", "double", "boolean", "char"],
  "answer": "int",
  "explanation": "Roll numbers are whole numbers, so int is most appropriate."
}');

-- =============================
-- Topic 2: Float
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(2, '{
  "question": "What is the size of a float in Java?",
  "options": ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
  "answer": "4 bytes",
  "explanation": "A float is a 32-bit IEEE 754 single-precision value."
}'),
(2, '{
  "question": "Which suffix is used to denote a float literal in Java?",
  "options": ["f", "d", "F", "both f and F"],
  "answer": "both f and F",
  "explanation": "Float literals must end with f or F (e.g., 3.14f)."
}'),
(2, '{
  "question": "Which data type has more precision: float or double?",
  "options": ["float", "double", "same", "depends on JVM"],
  "answer": "double",
  "explanation": "double is 64-bit and has higher precision than 32-bit float."
}'),
(2, '{
  "question": "What is the default value of a float variable?",
  "options": ["0.0", "0", "null", "NaN"],
  "answer": "0.0",
  "explanation": "The default for float and double is 0.0."
}');

-- =============================
-- Topic 3: String
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(3, '{
  "question": "Which of these is used to create a string object?",
  "options": ["new String()", "String()", "create String()", "String.new()"],
  "answer": "new String()",
  "explanation": "String can be created using literal or new String() constructor."
}'),
(3, '{
  "question": "Strings in Java are ____?",
  "options": ["mutable", "immutable", "dynamic", "changeable"],
  "answer": "immutable",
  "explanation": "Once created, a String object cannot be changed in Java."
}'),
(3, '{
  "question": "Which method is used to find the length of a String?",
  "options": ["size()", "length()", "count()", "getLength()"],
  "answer": "length()",
  "explanation": "String.length() returns the number of characters."
}'),
(3, '{
  "question": "What will be the result of ''Hello''.concat(''World'')?",
  "options": ["HelloWorld", "Hello World", "Hello", "Error"],
  "answer": "HelloWorld",
  "explanation": "concat() appends the specified string."
}');

-- =============================
-- Topic 4: Boolean
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(4, '{
  "question": "How many values can a boolean variable hold?",
  "options": ["1", "2", "3", "infinite"],
  "answer": "2",
  "explanation": "boolean can hold only true or false."
}'),
(4, '{
  "question": "What is the default value of a boolean variable?",
  "options": ["true", "false", "null", "0"],
  "answer": "false",
  "explanation": "All boolean primitives default to false."
}'),
(4, '{
  "question": "Which operator is used for logical AND in Java?",
  "options": ["&", "&&", "|", "and"],
  "answer": "&&",
  "explanation": "&& is the short-circuit logical AND operator."
}'),
(4, '{
  "question": "Which expression returns true if either condition is true?",
  "options": ["&&", "||", "!", "=="],
  "answer": "||",
  "explanation": "|| evaluates to true if at least one operand is true."
}');

-- =============================
-- Topic 5: If-Else
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(5, '{
  "question": "Which keyword is used for decision making in Java?",
  "options": ["decision", "if", "switch", "case"],
  "answer": "if",
  "explanation": "The if keyword controls conditional execution."
}'),
(5, '{
  "question": "What happens if the condition in if statement is false?",
  "options": ["if block executes", "else block executes", "error", "none"],
  "answer": "else block executes",
  "explanation": "When condition is false, control moves to the else block."
}'),
(5, '{
  "question": "An if-else statement can be nested?",
  "options": ["Yes", "No", "Only one level", "Depends on compiler"],
  "answer": "Yes",
  "explanation": "if statements can be nested inside another if or else block."
}'),
(5, '{
  "question": "Which of these is valid syntax?",
  "options": ["if(condition)", "if condition", "if: condition", "if = condition"],
  "answer": "if(condition)",
  "explanation": "The condition must be enclosed in parentheses."
}');

-- =============================
-- Topic 6: Switch
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(6, '{
  "question": "Which data types are allowed in switch?",
  "options": ["int, char, String, enum", "float", "boolean", "double"],
  "answer": "int, char, String, enum",
  "explanation": "Switch supports byte, short, int, char, enum, and String."
}'),
(6, '{
  "question": "Which keyword is used to exit a switch case?",
  "options": ["exit", "end", "stop", "break"],
  "answer": "break",
  "explanation": "break exits the switch statement after executing a case."
}'),
(6, '{
  "question": "What happens if break is omitted?",
  "options": ["Error", "Fall-through to next case", "Stops execution", "Skips case"],
  "answer": "Fall-through to next case",
  "explanation": "Without break, control moves to subsequent case labels."
}'),
(6, '{
  "question": "Which keyword is used to define default case?",
  "options": ["otherwise", "default", "else", "finally"],
  "answer": "default",
  "explanation": "default case executes if no case matches."
}');

-- =============================
-- Topic 7: For Loop
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(7, '{
  "question": "Which of the following is correct syntax of for loop?",
  "options": ["for i=0;i<10;i++", "for(int i=0;i<10;i++)", "for i<10", "loop(i<10)"],
  "answer": "for(int i=0;i<10;i++)",
  "explanation": "for(initialization; condition; update) is correct syntax."
}'),
(7, '{
  "question": "A for loop executes ____ times?",
  "options": ["until condition is true", "until condition is false", "only once", "forever"],
  "answer": "until condition is false",
  "explanation": "The loop runs until condition evaluates to false."
}'),
(7, '{
  "question": "Can a for loop have no initialization?",
  "options": ["Yes", "No", "Syntax error", "Only in while loop"],
  "answer": "Yes",
  "explanation": "Initialization is optional in for loops."
}'),
(7, '{
  "question": "Which keyword immediately ends a loop?",
  "options": ["continue", "break", "exit", "stop"],
  "answer": "break",
  "explanation": "break exits the nearest loop immediately."
}');

-- =============================
-- Topic 8: While Loop
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(8, '{
  "question": "Which keyword starts a while loop?",
  "options": ["loop", "while", "iterate", "repeat"],
  "answer": "while",
  "explanation": "while keyword defines a while loop in Java."
}'),
(8, '{
  "question": "A while loop executes while condition is?",
  "options": ["true", "false", "0", "undefined"],
  "answer": "true",
  "explanation": "The loop continues as long as the condition is true."
}'),
(8, '{
  "question": "Can while loop run infinitely?",
  "options": ["Yes", "No", "Only once", "Never"],
  "answer": "Yes",
  "explanation": "If condition never becomes false, while loop runs infinitely."
}'),
(8, '{
  "question": "Which part of while loop can be omitted?",
  "options": ["condition", "body", "both", "none"],
  "answer": "none",
  "explanation": "while loop requires a condition and a body."
}');

-- =============================
-- Topic 9: Function Declaration
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(9, '{
  "question": "Which keyword is used to define a method in Java?",
  "options": ["def", "function", "method", "void"],
  "answer": "void",
  "explanation": "Methods in Java use return type like void or int, not def."
}'),
(9, '{
  "question": "What does a method signature include?",
  "options": ["name and parameters", "only name", "only parameters", "return type"],
  "answer": "name and parameters",
  "explanation": "A method signature is its name and parameter list."
}'),
(9, '{
  "question": "Can methods be defined inside other methods?",
  "options": ["Yes", "No", "Only static ones", "Only in interfaces"],
  "answer": "No",
  "explanation": "Java does not support nested method definitions."
}'),
(9, '{
  "question": "Which keyword defines the method that belongs to class?",
  "options": ["static", "class", "final", "this"],
  "answer": "static",
  "explanation": "Static methods belong to the class, not instance."
}');

-- =============================
-- Topic 10: Function Parameters
-- =============================
INSERT INTO mcqs (topic_id, content) VALUES
(10, '{
  "question": "What are the values passed into a method called?",
  "options": ["arguments", "parameters", "values", "inputs"],
  "answer": "arguments",
  "explanation": "Arguments are actual values passed to parameters."
}'),
(10, '{
  "question": "Can a method have multiple parameters?",
  "options": ["Yes", "No", "Only two", "Only if static"],
  "answer": "Yes",
  "explanation": "Methods can have any number of parameters."
}'),
(10, '{
  "question": "What happens if a method has no return type?",
  "options": ["Error", "Defaults to int", "Must use void", "Ignored by compiler"],
  "answer": "Must use void",
  "explanation": "void specifies the method returns nothing."
}'),
(10, '{
  "question": "Which keyword is used to return a value from a method?",
  "options": ["break", "return", "exit", "output"],
  "answer": "return",
  "explanation": "return keyword sends a value back to caller."
}');