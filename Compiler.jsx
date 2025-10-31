import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import '../Styles/Compiler.css';
import axios from 'axios';
import Navbar from "./Navbar";
import { useParams, Link } from "react-router-dom";
import { Toaster, toast } from 'sonner';
import { TbBulb } from "react-icons/tb";
import { TfiUnlock, TfiLock } from "react-icons/tfi";
import { IoCloseSharp } from "react-icons/io5";
import { useLocation } from 'react-router-dom'

// Full Screen Overlay Loader Component
const FullScreenLoader = ({
                              isVisible,
                              message = "Processing...",
                              subMessage = "Please wait while we process your request",
                              loaderType = "spinner" // spinner, pulse, dots, wave, enhanced
                          }) => {
    if (!isVisible) return null;

    const renderLoader = () => {
        switch (loaderType) {
            case 'pulse':
                return <div className="pulse-loader"></div>;
            case 'dots':
                return (
                    <div className="dots-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                );
            case 'wave':
                return (
                    <div className="wave-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                );
            case 'enhanced':
                return <div className="spinner-enhanced"></div>;
            default:
                return <div className="spinner"></div>;
        }
    };

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                {renderLoader()}
                <h3 className="loader-text">{message}</h3>
                {subMessage && <p className="loader-subtext">{subMessage}</p>}
                <div className="loader-progress"></div>
            </div>
        </div>
    );
};

// Generate random math problems
const generateMathProblem = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 25;
            num2 = Math.floor(Math.random() * 25) + 1;
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            answer = num1 * num2;
            break;
        default:
            num1 = 2;
            num2 = 2;
            answer = 4;
    }

    return {
        question: `What is ${num1} ${operation} ${num2}?`,
        answer: answer
    };
};

// Sidebar Help Component
const SidebarHelp = ({ hint, syntax, sol, onClose }) => {
    const { Condition } = syntax?.[0] || { Condition: [] };

    const [syntaxLock, setSyntaxLock] = useState(true);
    const [selected, setSelected] = useState('hint');
    const [solLock, setSolLock] = useState(true);
    const [mathProblem, setMathProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [showMathChallenge, setShowMathChallenge] = useState(false);
    const [pendingSection, setPendingSection] = useState(null);

    const handleSectionClick = (section) => {
        if (section === 'hint') {
            setSelected('hint');
            setShowMathChallenge(false);
            return;
        }

        if ((section === 'syntax' && syntaxLock) || (section === 'solution' && solLock)) {
            const problem = generateMathProblem();
            setMathProblem(problem);
            setPendingSection(section);
            setShowMathChallenge(true);
            setUserAnswer('');
        } else {
            setSelected(section);
            setShowMathChallenge(false);
        }
    };

    const handleMathSubmit = () => {
        const answer = parseInt(userAnswer);
        if (answer === mathProblem.answer) {
            setShowMathChallenge(false);
            if (pendingSection === 'syntax') {
                setSyntaxLock(false);
                setSelected('syntax');
            } else if (pendingSection === 'solution') {
                const confirmResult = window.confirm('If you see the full solution before solving, your score will not get added');
                if (confirmResult) {
                    setSolLock(false);
                    setSelected('solution');
                } else {
                    setShowMathChallenge(false);
                    return;
                }
            }
            setPendingSection(null);
            toast.success('Correct! Access granted.');
        } else {
            toast.error('Incorrect answer. Try again!');
            setUserAnswer('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleMathSubmit();
        }
    };

    return (
        <div className="sidebar-help-content">
            <div className="help-header">
                <button className="close-help-btn" onClick={onClose}>
                    <IoCloseSharp />
                </button>
            </div>
            <hr className="help-divider" />
            <nav className="help-navigation-tabs">
        <span
            className={`help-nav-tab ${selected === 'hint' ? 'selected' : ''}`}
            onClick={() => handleSectionClick('hint')}
        >
          <b>Hint</b>
          <TfiUnlock className="unlock-icon" />
        </span>

                <span
                    className={`help-nav-tab ${selected === 'syntax' ? 'selected' : ''}`}
                    onClick={() => handleSectionClick('syntax')}
                >
          <b>Syntax</b>
                    {syntaxLock ? <TfiLock className="lock-icon" /> : <TfiUnlock className="unlock-icon" />}
        </span>

                <span
                    className={`help-nav-tab ${selected === 'solution' ? 'selected' : ''}`}
                    onClick={() => handleSectionClick('solution')}
                >
          <b>Full Solution</b>
                    {solLock ? <TfiLock className="lock-icon" /> : <TfiUnlock className="unlock-icon" />}
        </span>
            </nav>

            <hr className="help-divider" />

            <div className="help-content-area">
                {showMathChallenge ? (
                    <div className="math-challenge-container">
                        <h3>Solve this problem to unlock:</h3>
                        <div className="math-question-display">{mathProblem?.question}</div>
                        <input
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Enter your answer"
                            className="math-answer-input"
                            onKeyPress={handleKeyPress}
                            autoFocus
                        />
                        <div className="math-action-buttons">
                            <button onClick={handleMathSubmit} className="math-submit-button">
                                Submit
                            </button>
                            <button
                                onClick={() => setShowMathChallenge(false)}
                                className="math-cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {selected === 'hint' && (
                            <div className="help-section">
                                <h4>Hint:</h4>
                                <pre className="help-code-block"><code>{hint}</code></pre>
                            </div>
                        )}
                        {selected === 'syntax' && !syntaxLock && (
                            <div className="help-section">
                                <h4>Syntax Breakdown:</h4>
                                {Condition?.map((item, index) => (
                                    <pre key={index} className="help-code-block"><code>{item}</code></pre>
                                ))}
                            </div>
                        )}
                        {selected === 'solution' && !solLock && (
                            <div className="help-section">
                                <h4>Full Solution:</h4>
                                <pre className="help-code-block"><code>{sol}</code></pre>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Main Compiler Component
const Compiler = ({ onLogout }) => {
    const { questionId } = useParams();
    const location = useLocation();

    // State Management
    const [pythonCode, setPythonCode] = useState("");
    const [javaCode, setJavaCode] = useState("");
    const [javaScriptCode, setJavaScriptCode] = useState("");
    const [typeScriptCode, setTypeScriptCode] = useState("");
    const [code, setCode] = useState("// Write your code here \n public class Main { \n}");
    const [pseudoCode, setPseudoCode] = useState("// Write pseudo code first");
    const [language, setLanguage] = useState("java");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);
    const [checkCodeLoading, setCheckCodeLoading] = useState(false);
    const [algorithmLoading, setAlgorithmLoading] = useState(false);
    const [question, setQuestion] = useState(null);
    const [javaCompleted, setJavaCompleted] = useState(false);
    const [pythonCompleted, setPythonCompleted] = useState(false);
    const [javaScriptCompleted, setJavaScriptCompleted] = useState(false);
    const [typeScriptCompleted, setTypeScriptCompleted] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [algorithm, setAlgorithm] = useState("// Write algorithm first");
    const [feedback, setFeedback] = useState("");
    const [passedCount, setPassedCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [currentEditor, setCurrentEditor] = useState('algorithm');

    // Timer state - per language tracking (in seconds)
    const [javaTime, setJavaTime] = useState(0);
    const [pythonTime, setPythonTime] = useState(0);
    const [javascriptTime, setJavascriptTime] = useState(0);
    const [typescriptTime, setTypescriptTime] = useState(0);
    const [algorithmTime, setAlgorithmTime] = useState(0);
    const [pseudocodeTime, setPseudocodeTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Track last saved time to send only deltas to backend
    const [lastSavedJavaTime, setLastSavedJavaTime] = useState(0);
    const [lastSavedPythonTime, setLastSavedPythonTime] = useState(0);
    const [lastSavedJavascriptTime, setLastSavedJavascriptTime] = useState(0);
    const [lastSavedTypescriptTime, setLastSavedTypescriptTime] = useState(0);
    const [lastSavedAlgorithmTime, setLastSavedAlgorithmTime] = useState(0);
    const [lastSavedPseudocodeTime, setLastSavedPseudocodeTime] = useState(0);

    // Resizer states
    const [leftWidth, setLeftWidth] = useState(30);
    const [bottomHeight, setBottomHeight] = useState(30);
    const [isResizing, setIsResizing] = useState(null);

    // Validation states
    const [algorithmValidated, setAlgorithmValidated] = useState(false);
    const [pseudoValidated, setPseudoValidated] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [savedWithoutChange, setSavedWithoutChange] = useState(true);
    const [javaSavedCode, setJavaSavedCode] = useState("");
    const [pythonSavedCode, setPythonSavedCode] = useState("");
    const [javaScriptSavedCode, setJavaScriptSavedCode] = useState("");
    const [typeScriptSavedCode, setTypeScriptSavedCode] = useState("");

    // Auto-save interval ref
    const autoSaveIntervalRef = React.useRef(null);
    const timerIntervalRef = React.useRef(null);

    // ==================== FETCH ALL DATA FROM DATABASE ====================
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch question and saved codes
                const problemResponse = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/user/problem-submissions/${questionId}`
                );

                const data = problemResponse.data;
                const foundQuestion = data.problemDTO;

                if (foundQuestion) {
                    setQuestion(foundQuestion);
                    if (foundQuestion.testCases && foundQuestion.testCases.length > 0) {
                        setInput(foundQuestion.testCases[0].input || "");
                    }
                }

                // Load saved codes
                if (data.savedCodes) {
                    setJavaCode(data.savedCodes.java || "// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}");
                    setPythonCode(data.savedCodes.python || "# Write your Python code here\n");
                    setJavaScriptCode(data.savedCodes.javascript || "// Write your JavaScript code here\n");
                    setTypeScriptCode(data.savedCodes.typescript || "// Write your TypeScript code here\n");

                    setJavaSavedCode(data.savedCodes.java || "// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}");
                    setPythonSavedCode(data.savedCodes.python || "# Write your Python code here\n");
                    setJavaScriptSavedCode(data.savedCodes.javascript || "// Write your JavaScript code here\n");
                    setTypeScriptSavedCode(data.savedCodes.typescript || "// Write your TypeScript code here\n");

                    // Set current code based on language
                    setCode(data.savedCodes.java || "// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}");
                }

                // Load time spent for each language
                setJavaTime(data.javaTimeSeconds || 0);
                setPythonTime(data.pythonTimeSeconds || 0);
                setJavascriptTime(data.javascriptTimeSeconds || 0);
                setTypescriptTime(data.typescriptTimeSeconds || 0);

                // 🔧 FIX: Initialize lastSaved times to prevent duplication on first auto-save
                setLastSavedJavaTime(data.javaTimeSeconds || 0);
                setLastSavedPythonTime(data.pythonTimeSeconds || 0);
                setLastSavedJavascriptTime(data.javascriptTimeSeconds || 0);
                setLastSavedTypescriptTime(data.typescriptTimeSeconds || 0);

                // Fetch algorithm
                let fetchedAlgorithmTime = 0;
                let fetchedAlgorithmValidated = false;
                try {
                    const algoResponse = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/user/algorithm-submissions/problem/${questionId}`
                    );
                    if (algoResponse.data.content) {
                        setAlgorithm(algoResponse.data.content);
                        fetchedAlgorithmTime = algoResponse.data.totalSecondSpent || 0;
                        setAlgorithmTime(fetchedAlgorithmTime);
                        // 🔧 FIX: Initialize lastSaved algorithm time
                        setLastSavedAlgorithmTime(fetchedAlgorithmTime);
                    }
                } catch (err) {
                    console.log("No algorithm found, using default");
                }

                // Fetch pseudocode
                let fetchedPseudocodeTime = 0;
                let fetchedPseudoValidated = false;
                try {
                    const pseudoResponse = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/user/pseudocode-submissions/problem/${questionId}`
                    );
                    if (pseudoResponse.data.content) {
                        setPseudoCode(pseudoResponse.data.content);
                        fetchedPseudocodeTime = pseudoResponse.data.totalSecondSpent || 0;
                        setPseudocodeTime(fetchedPseudocodeTime);
                        // 🔧 FIX: Initialize lastSaved pseudocode time
                        setLastSavedPseudocodeTime(fetchedPseudocodeTime);
                    }
                } catch (err) {
                    console.log("No pseudocode found, using default");
                }

                // Check validation status
                try {
                    const algoValidResponse = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/user/algorithm-submissions/problem/${questionId}/is-correct`
                    );
                    fetchedAlgorithmValidated = algoValidResponse.data;
                    setAlgorithmValidated(fetchedAlgorithmValidated);
                } catch (err) {
                    setAlgorithmValidated(false);
                }

                try {
                    const pseudoValidResponse = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/user/pseudocode-submissions/problem/${questionId}/is-correct`
                    );
                    fetchedPseudoValidated = pseudoValidResponse.data;
                    setPseudoValidated(fetchedPseudoValidated);
                } catch (err) {
                    setPseudoValidated(false);
                }

                // Fetch completion status (tick marks)
                try {
                    const submissionsResponse = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/user/problem-submissions/${questionId}/submissions`
                    );
                    submissionsResponse.data.forEach(element => {
                        if (element.isCorrect === true) {
                            if (element.language === 'JAVA') setJavaCompleted(true);
                            else if (element.language === 'PYTHON') setPythonCompleted(true);
                            else if (element.language === 'JAVASCRIPT') setJavaScriptCompleted(true);
                            else if (element.language === 'TYPESCRIPT') setTypeScriptCompleted(true);
                        }
                    });
                } catch (err) {
                    console.log("Error fetching submissions:", err);
                }

                // Determine current editor
                const editor = fetchedAlgorithmValidated ? (fetchedPseudoValidated ? 'code' : 'pseudocode') : 'algorithm';
                setCurrentEditor(editor);

                // 🔧 FIX: Set currentTime based on the active editor after determining it
                let initialTime = 0;
                if (editor === 'algorithm') {
                    initialTime = fetchedAlgorithmTime;
                } else if (editor === 'pseudocode') {
                    initialTime = fetchedPseudocodeTime;
                } else if (editor === 'code') {
                    initialTime = data.javaTimeSeconds || 0; // Default to Java time for code editor
                }
                setCurrentTime(initialTime);

                setDataLoaded(true);
                console.log("✅ All data loaded from database");

            } catch (error) {
                console.error("❌ Error fetching data:", error);
                toast.error("Failed to load problem data");
                setDataLoaded(true);
            }
        };

        fetchAllData();
    }, [questionId]);

    // ==================== AUTO-SAVE TO DATABASE EVERY 15 SECONDS ====================
    const saveToDatabase = async () => {
        try {
            if (!dataLoaded) return;

            console.log("💾 Auto-saving to database...");

            // Save based on current editor
            if (currentEditor === 'algorithm') {
                const timeDelta = algorithmTime - lastSavedAlgorithmTime;
                if (timeDelta > 0) {
                    const algoData = {
                        problemId: parseInt(questionId),
                        content: algorithm,
                        isCorrect: algorithmValidated,
                        totalSecondSpent: timeDelta  // Send only the delta (increment)
                    };
                    await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/user/algorithm-submissions`,
                        algoData,
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    setLastSavedAlgorithmTime(algorithmTime);  // Update last saved time
                    console.log("✅ Algorithm saved with time delta:", timeDelta);
                }
            }
            else if (currentEditor === 'pseudocode') {
                const timeDelta = pseudocodeTime - lastSavedPseudocodeTime;
                if (timeDelta > 0) {
                    const pseudoData = {
                        problemId: parseInt(questionId),
                        content: pseudoCode,
                        isCorrect: pseudoValidated,
                        totalSecondSpent: timeDelta  // Send only the delta (increment)
                    };
                    await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/user/pseudocode-submissions`,
                        pseudoData,
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    setLastSavedPseudocodeTime(pseudocodeTime);  // Update last saved time
                    console.log("✅ Pseudocode saved with time delta:", timeDelta);
                }
            }
            else if (currentEditor === 'code') {
                // Calculate time deltas for each language
                const javaDelta = javaTime - lastSavedJavaTime;
                const pythonDelta = pythonTime - lastSavedPythonTime;
                const jsDelta = javascriptTime - lastSavedJavascriptTime;
                const tsDelta = typescriptTime - lastSavedTypescriptTime;

                // Only save if there's a time change
                if (javaDelta > 0 || pythonDelta > 0 || jsDelta > 0 || tsDelta > 0) {
                    const codeData = {
                        problemId: parseInt(questionId),
                        savedCodes: {
                            java: javaCode,
                            python: pythonCode,
                            javascript: javaScriptCode,
                            typescript: typeScriptCode
                        },
                        javaTimeSeconds: javaDelta,      // Send deltas, not cumulative
                        pythonTimeSeconds: pythonDelta,
                        javascriptTimeSeconds: jsDelta,
                        typescriptTimeSeconds: tsDelta
                    };
                    await axios.put(
                        `${import.meta.env.VITE_API_BASE_URL}/user/problem-submissions/save-code`,
                        codeData,
                        { headers: { 'Content-Type': 'application/json' } }
                    );

                    // Update last saved times
                    setLastSavedJavaTime(javaTime);
                    setLastSavedPythonTime(pythonTime);
                    setLastSavedJavascriptTime(javascriptTime);
                    setLastSavedTypescriptTime(typescriptTime);

                    console.log("✅ Code and time deltas saved to DB:", {
                        javaDelta,
                        pythonDelta,
                        jsDelta,
                        tsDelta
                    });
                }
            }

        } catch (error) {
            console.error("❌ Auto-save error:", error);
        }
    };

    // Setup auto-save interval (every 15 seconds)
    useEffect(() => {
        if (dataLoaded) {
            autoSaveIntervalRef.current = setInterval(() => {
                saveToDatabase();
            }, 15000); // 15 seconds

            return () => {
                if (autoSaveIntervalRef.current) {
                    clearInterval(autoSaveIntervalRef.current);
                }
            };
        }
    }, [dataLoaded, currentEditor, algorithm, pseudoCode, javaCode, pythonCode, javaScriptCode, typeScriptCode,
        javaTime, pythonTime, javascriptTime, typescriptTime, algorithmTime, pseudocodeTime]);

    // ==================== TIMER - INCREMENTS EVERY SECOND ====================
    useEffect(() => {
        if (!dataLoaded) return;

        timerIntervalRef.current = setInterval(() => {
            if (currentEditor === 'algorithm') {
                setAlgorithmTime(prev => {
                    const newTime = prev + 1;
                    setCurrentTime(newTime);  // Update display timer
                    return newTime;
                });
            } else if (currentEditor === 'pseudocode') {
                setPseudocodeTime(prev => {
                    const newTime = prev + 1;
                    setCurrentTime(newTime);  // Update display timer
                    return newTime;
                });
            } else if (currentEditor === 'code') {
                // Increment time for current language
                if (language === 'java') {
                    setJavaTime(prev => {
                        const newTime = prev + 1;
                        setCurrentTime(newTime);
                        return newTime;
                    });
                } else if (language === 'python') {
                    setPythonTime(prev => {
                        const newTime = prev + 1;
                        setCurrentTime(newTime);
                        return newTime;
                    });
                } else if (language === 'javascript') {
                    setJavascriptTime(prev => {
                        const newTime = prev + 1;
                        setCurrentTime(newTime);
                        return newTime;
                    });
                } else if (language === 'typescript') {
                    setTypescriptTime(prev => {
                        const newTime = prev + 1;
                        setCurrentTime(newTime);
                        return newTime;
                    });
                }
            }
        }, 1000);

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [dataLoaded, currentEditor, language]);

    // ==================== SAVE ON LANGUAGE SWITCH ====================
    useEffect(() => {
        if (!dataLoaded) return;

        const saveAndSwitch = async () => {
            await saveToDatabase();

            // Update current code based on language
            if (language === 'java') {
                setCode(javaCode);
                setCurrentTime(javaTime);
            } else if (language === 'python') {
                setCode(pythonCode);
                setCurrentTime(pythonTime);
            } else if (language === 'javascript') {
                setCode(javaScriptCode);
                setCurrentTime(javascriptTime);
            } else if (language === 'typescript') {
                setCode(typeScriptCode);
                setCurrentTime(typescriptTime);
            }
        };

        saveAndSwitch();
    }, [language]);

    // ==================== SAVE ON TAB/WINDOW CLOSE ====================
    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            event.preventDefault();
            await saveToDatabase();
            event.returnValue = "";
        };

        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await saveToDatabase();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            // Final save on unmount
            saveToDatabase();
        };
    }, [dataLoaded, currentEditor, algorithm, pseudoCode, javaCode, pythonCode, javaScriptCode, typeScriptCode,
        javaTime, pythonTime, javascriptTime, typescriptTime, algorithmTime, pseudocodeTime]);

    // ==================== HANDLER FUNCTIONS ====================
    const handleShowFeedback = async () => {
        if (!question) {
            toast.error("Question not loaded yet!");
            return;
        }

        try {
            toast.loading("Generating feedback...");
            const response = await axios.post(
                `${import.meta.env.VITE_AI_URL}/generate-overall-feedback`,
                { question: question.text, code, language, passedCount }
            );

            if (response?.data?.feedback_report) {
                setFeedback(`AI Feedback: ${response.data.feedback_report}`);
                toast.success("Feedback generated!");
            } else {
                setFeedback("⚠️ No feedback received. Please try again.");
            }
        } catch (err) {
            setFeedback("⚠️ Error generating feedback. Please try again later.");
            toast.error("Feedback generation failed!");
        }
    };

    const checkAlgorithm = async () => {
        if (!question) {
            setFeedback("Question not loaded yet. Please wait.");
            return;
        }

        if (!algorithm.trim() || algorithm.trim() === "// Write algorithm first") {
            setFeedback("Please write some algorithm first.");
            return;
        }

        setAlgorithmLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_AI_URL}/check-algorithm`, {
                question: question.description,
                algorithm: JSON.stringify(algorithm)
            });

            if (res?.data?.valid) {
                setAlgorithmValidated(true);
                await saveToDatabase();
                setCurrentEditor('pseudocode');
                setFeedback("✅ Your algorithm is correct! Now write pseudocode.");
            } else {
                setFeedback(`❌ ${res.data.feedback || "Algorithm validation failed. Try again."}`);
            }
        } catch (error) {
            setFeedback("⚠️ Error checking algorithm. Please try again.");
        } finally {
            setAlgorithmLoading(false);
        }
    };

    const checkCode = async () => {
        if (!question) {
            setFeedback("Question not loaded yet. Please wait.");
            return;
        }

        if (!pseudoCode.trim() || pseudoCode.trim() === "// Write pseudo code first") {
            setFeedback("Please write some pseudocode first.");
            return;
        }

        setCheckLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_AI_URL}/check-pseudocode`, {
                question: question.description,
                pseudocode: JSON.stringify(pseudoCode)
            });

            if (res?.data?.valid) {
                setPseudoValidated(true);
                await saveToDatabase();
                setCurrentEditor('code');
                setFeedback("✅ Your pseudocode is correct! Now you can solve the question.");
            } else {
                setFeedback(`❌ ${res.data.feedback || "Pseudocode validation failed. Try again."}`);
            }
        } catch (error) {
            setFeedback("⚠️ Error checking pseudocode. Please try again.");
        } finally {
            setCheckLoading(false);
        }
    };

    const CodeEditor = async () => {
        if (!question) {
            setFeedback("Question not loaded yet. Please wait.");
            return;
        }

        if (!code.trim()) {
            setFeedback("Please write some code first.");
            return;
        }

        setCheckCodeLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_AI_URL}/check-code`,
                { question: question.description, code: JSON.stringify(code), language }
            );

            if (res?.data?.valid) {
                setFeedback("✅ Your code looks good. Running...");
            } else {
                setFeedback(`❌ ${res.data.feedback}`);
            }
        } catch (error) {
            setFeedback("⚠️ Error checking code. Please try again.");
        } finally {
            setCheckCodeLoading(false);
        }
    };

    // Format Time Function
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins
            .toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Mouse event handlers for resizing
    const handleMouseDown = (type) => (e) => {
        setIsResizing(type);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;

        if (isResizing === 'horizontal') {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 60) {
                setLeftWidth(newWidth);
            }
        } else if (isResizing === 'vertical') {
            const rect = document.querySelector('.editor-section')?.getBoundingClientRect();
            if (rect) {
                const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
                if (newHeight > 20 && newHeight < 80) {
                    setBottomHeight(100 - newHeight);
                }
            }
        }
    };

    const handleMouseUp = () => {
        setIsResizing(null);
    };

    const setcodesnippet = (lang) => {
        if (lang === "java") setCode(javaSavedCode || "// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}");
        else if (lang === "python") setCode(pythonSavedCode || "# Write your Python code here\n")
        else if (lang === "javascript") setCode(javaScriptSavedCode || "// Write your JavaScript code here\n")
        else setCode(typeScriptSavedCode || "// Write your TypeScript code here\n")
    }

    // Resizing Effect
    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing]);

    // Editor Change Handlers
    // const handleEditorChange1 = (value) => setCode(value || "");
    const handleEditorChange1 = (value) => {
        setSavedWithoutChange(false)
        if (language === 'java') {
            setJavaCode(value || javaSavedCode);
        }
        else if (language === 'python') {
            setPythonCode(value || pythonSavedCode);
        }
        else if (language === 'javascript') {
            setJavaScriptCode(value || javaScriptSavedCode);
        }
        else if (language === 'typescript') {
            setTypeScriptCode(value || typeScriptSavedCode);
        }
        setCode(value || code);
    }
    const handleEditorChange2 = (value) => setPseudoCode(value || "");
    const handleEditorChange3 = (value) => setAlgorithm(value || "");

    // Language Change Handler
    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        setcodesnippet(lang);
    };

    // Input Change Handler
    const handleInputChange = (e) => setInput(e.target.value);

    // Save Code Function
    const saveCode = async () => {
        if (currentEditor === 'code') {
            try {
                // Calculate time deltas
                const javaDelta = javaTime - lastSavedJavaTime;
                const pythonDelta = pythonTime - lastSavedPythonTime;
                const jsDelta = javascriptTime - lastSavedJavascriptTime;
                const tsDelta = typescriptTime - lastSavedTypescriptTime;

                const responseDataCode = {
                    "problemId": questionId,
                    "savedCodes": {
                        "java": (language === 'java') ? javaCode : javaSavedCode,
                        "python": (language === 'python') ? pythonCode : pythonSavedCode,
                        "javascript": (language === 'javascript') ? javaScriptCode : javaScriptSavedCode,
                        "typescript": (language === 'typescript') ? typeScriptCode : typeScriptSavedCode
                    },
                    "javaTimeSeconds": javaDelta,      // Send deltas, not cumulative
                    "pythonTimeSeconds": pythonDelta,
                    "javascriptTimeSeconds": jsDelta,
                    "typescriptTimeSeconds": tsDelta
                }

                console.log("💾 Saving code with time deltas:", {
                    javaDelta,
                    pythonDelta,
                    jsDelta,
                    tsDelta
                });

                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/user/problem-submissions/save-code`,
                    responseDataCode,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );

                // Update last saved times
                setLastSavedJavaTime(javaTime);
                setLastSavedPythonTime(pythonTime);
                setLastSavedJavascriptTime(javascriptTime);
                setLastSavedTypescriptTime(typescriptTime);

                if (!savedWithoutChange) {
                    toast.success("Code and time saved successfully");
                } else {
                    toast.success("Time saved successfully");
                }
                setSavedWithoutChange(true);
            } catch (err) {
                console.error("Save error:", err);
                toast.error("Code saving failed");
            }
        }
        else if (currentEditor === 'algorithm') {
            try {
                const timeDelta = algorithmTime - lastSavedAlgorithmTime;

                const responseDataAlgorithm = {
                    "problemId": questionId,
                    "content": algorithm,
                    "isCorrect": algorithmValidated,
                    "totalSecondSpent": timeDelta  // Send delta, not cumulative
                }

                console.log("💾 Saving algorithm with time delta:", timeDelta);

                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/user/algorithm-submissions`,
                    responseDataAlgorithm,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );

                setLastSavedAlgorithmTime(algorithmTime);  // Update last saved time
                toast.success("Algorithm Saved Successfully");
            } catch (err) {
                console.error(err);
                toast.error("Algorithm saving failed");
            }
        }
        else if (currentEditor === 'pseudocode') {
            try {
                const timeDelta = pseudocodeTime - lastSavedPseudocodeTime;

                const responseDataPseudocode = {
                    "problemId": questionId,
                    "content": pseudoCode,
                    "isCorrect": pseudoValidated,
                    "totalSecondSpent": timeDelta  // Send delta, not cumulative
                }

                console.log("💾 Saving pseudocode with time delta:", timeDelta);

                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/user/pseudocode-submissions`,
                    responseDataPseudocode,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );

                setLastSavedPseudocodeTime(pseudocodeTime);  // Update last saved time
                toast.success("Pseudocode Saved Successfully");
            } catch (err) {
                console.error(err);
                toast.error("Pseudocode saving failed");
            }
        }
    };

    const runCode = async () => {
        if (!code.trim()) {
            toast.error("Please write some code first.");
            return;
        }

        setLoading(true);
        setOutput("Running...");

        try {
            // 🔧 FIX: Use environment variable for code executor URL
            const response = await axios.post(`${import.meta.env.VITE_CODE_EXECUTOR_URL || "http://172.20.201.87:5010"}/api/v1/run`, {
                language,
                source: code,
                input: input.replace(" ", "\n")
            });

            setOutput(response.data.output || "No output received");
        } catch (error) {
            console.error("Run error:", error);
            setOutput(error.response?.data?.error || "Compilation/Runtime Error");
        } finally {
            setLoading(false);
        }
    };

    const submitCode = async () => {
        if (!question || !question.testCases) {
            toast.error("No test cases available for this question.");
            return;
        }

        if (!code.trim()) {
            toast.error("Please write some code first.");
            return;
        }

        setLoading(true);

        try {
            const testCases = question.testCases || [];
            let allPassed = true;
            let results = [];
            let localPassedCount = 0;

            const runTestCases = async (lang) => {
                for (let i = 0; i < testCases.length; i++) {
                    const test = testCases[i];
                    const userInput = test.input.replace(" ", "\n");

                    try {
                        // 🔧 FIX: Use environment variable for code executor URL
                        const response = await axios.post(`${import.meta.env.VITE_CODE_EXECUTOR_URL || "http://172.20.201.87:5010"}/api/v1/run`, {
                            language: lang,
                            source: code,
                            input: userInput,
                        });

                        const actualOutput = response.data.output?.trim() || "";
                        const expectedOutput = test.expectedOutput?.trim() || "";

                        if (actualOutput === expectedOutput) {
                            localPassedCount++;
                            results.push(`Test Case ${i + 1}: PASSED`);
                        } else {
                            allPassed = false;
                            results.push(`Test case ${i + 1}: Expected: ${expectedOutput} But Got: ${actualOutput}`);
                        }
                    } catch (error) {
                        allPassed = false;
                        results.push(`Test Case ${i + 1}: ERROR (${error.message || "Runtime/Compilation Error"})`);
                    }
                }
            };

            if (["java", "python", "javascript", "typescript"].includes(language)) {
                await runTestCases(language);
            } else {
                toast.error(`Language ${language} not supported.`);
                setLoading(false);
                return;
            }

            setPassedCount(localPassedCount);
            setOutput(results.join("\n"));

            if (allPassed) {
                toast.success(`All ${testCases.length} test cases passed!`);

                if (language === "python") setPythonCompleted(true);
                if (language === "java") setJavaCompleted(true);
                if (language === "javascript") setJavaScriptCompleted(true);
                if (language === "typescript") setTypeScriptCompleted(true);
            } else {
                toast.error(`${localPassedCount}/${testCases.length} test cases passed.`);
            }

            try {
                // 🔧 FIX: Calculate time delta BEFORE saving to database
                let languageTimeSpent = 0;
                if (language === 'java') {
                    languageTimeSpent = javaTime - lastSavedJavaTime;
                } else if (language === 'python') {
                    languageTimeSpent = pythonTime - lastSavedPythonTime;
                } else if (language === 'javascript') {
                    languageTimeSpent = javascriptTime - lastSavedJavascriptTime;
                } else if (language === 'typescript') {
                    languageTimeSpent = typescriptTime - lastSavedTypescriptTime;
                }

                console.log("📤 Submitting with time delta (computed BEFORE save):", languageTimeSpent, "seconds for", language);

                // Now save current work to database
                await saveToDatabase();

                // Update lastSaved times after saving
                if (language === 'java') setLastSavedJavaTime(javaTime);
                else if (language === 'python') setLastSavedPythonTime(pythonTime);
                else if (language === 'javascript') setLastSavedJavascriptTime(javascriptTime);
                else if (language === 'typescript') setLastSavedTypescriptTime(typescriptTime);

                const responseDataCodeSubmission = {
                    problemId: parseInt(questionId),
                    language: language.toUpperCase(),
                    code: code,
                    isCorrect: allPassed,
                    savedCodes: {
                        java: javaCode,
                        python: pythonCode,
                        javascript: javaScriptCode,
                        typescript: typeScriptCode,
                    },
                    totalSecondsSpent: languageTimeSpent,  // 🔧 FIX: Send delta, not cumulative
                    totalTestCasesPassed: localPassedCount,
                    totalTestCases: testCases.length,
                    insights: {},
                };

                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/user/problem-submissions/submission`,
                    responseDataCodeSubmission,
                    { headers: { "Content-Type": "application/json" } }
                );

                toast.success("Submission saved successfully!");
            } catch (err) {
                console.error("❌ Error saving submission:", err);
                console.error("❌ Error details:", err.response?.data || err.message);
                toast.error(`Failed to save submission: ${err.response?.data?.message || err.message}`);
            }

        } catch (error) {
            console.error("❌ Submit error:", error);
            toast.error(`Error submitting code: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };


    // ==================== FETCH COMPLETION STATUS ====================
    useEffect(() => {
        const fetchCompletionStatus = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/user/problem-submissions/${questionId}/submissions`
                );
                // 🔧 FIX: Add missing parentheses in forEach
                response.data.forEach(element => {
                    if (element.isCorrect === true) {
                        if (element.language === 'JAVA') setJavaCompleted(true);
                        else if (element.language === 'PYTHON') setPythonCompleted(true);
                        else if (element.language === 'JAVASCRIPT') setJavaScriptCompleted(true);
                        else if (element.language === 'TYPESCRIPT') setTypeScriptCompleted(true);
                    }
                });
            } catch (err) {
                console.error("❌ Error fetching completion status:", err);
            }
        };

        fetchCompletionStatus();
    }, [questionId, location.key]);

    return (
        <div className="compiler-container">
            <Toaster richColors position="top-center" />
            <Navbar onLogout={onLogout} />

            {/* Full Screen Overlay Loaders */}
            <FullScreenLoader
                isVisible={checkLoading}
                message="Validating Pseudocode"
                subMessage="AI is analyzing your pseudocode logic..."
                loaderType="enhanced"
            />
            <FullScreenLoader
                isVisible={checkCodeLoading}
                message="Validating Code"
                subMessage="AI is analyzing your code logic..."
                loaderType="enhanced"
            />
            <FullScreenLoader
                isVisible={algorithmLoading}
                message="Validating Algorithm"
                subMessage="AI is analyzing your algorithm logic..."
                loaderType="enhanced"
            />

            <FullScreenLoader
                isVisible={loading}
                message="Processing Code"
                subMessage="Running your code against test cases..."
                loaderType="wave"
            />

            <main className="compiler-content">
                {/* Left Section - Problem Description */}
                <div
                    className="description-section"
                    style={{ width: `${leftWidth}%` }}
                >
                    {showHelp ? (
                        <SidebarHelp
                            hint={question?.hint}
                            syntax={question?.syntax_breakdown}
                            sol={question?.solution}
                            onClose={() => setShowHelp(false)}
                        />
                    ) : (
                        question && (
                            <div className="description">
                                <Link to="/questions" state={{ selectedTopic: location.state?.selectedTopic, selectedSubTopic: location.state?.selectedSubTopic }}>
                                    <button className="comp-back-button">
                                        &larr;Back
                                    </button>
                                </Link>
                                <h2>{question.title}</h2>

                                <h3>Problem Statement:</h3>
                                <div className="comp-desc">{question.description}</div>

                                <h3>Difficulty:</h3>
                                <pre style={{ fontSize: "18px" }}>{question.difficulty}</pre>

                                {question.testCases && question.testCases.some(tc => tc.isPublic) ? (
                                    <>
                                        <h3>Sample Test Cases:</h3>
                                        {question.testCases
                                            .filter(tc => tc.isPublic)
                                            .map((tc, index) => (
                                                <div key={tc.testCaseId} className="testcase-block">
                                                    <h4>Test Case {index + 1}</h4>
                                                    <strong>Input:</strong>
                                                    <pre style={{ fontSize: "16px" }}>{tc.input}</pre>
                                                    <strong>Expected Output:</strong>
                                                    <pre style={{ fontSize: "16px" }}>{tc.expectedOutput}</pre>
                                                </div>
                                            ))}
                                    </>
                                ) : (
                                    <p>No public test cases available.</p>
                                )}
                            </div>
                        )
                    )}
                </div>

                {/* Horizontal Resizer */}
                <div
                    className="horizontal-resizer"
                    onMouseDown={handleMouseDown('horizontal')}
                />

                {/* Right Section - Editors and Output */}
                <div
                    className="editor-section"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                    {/* Toolbar */}
                    <div className="editor-toolbar">
                        {currentEditor === 'code' && (
                            <>
                                <label htmlFor="language-switcher" className="language-label">Choose Language:</label>
                                <select id="language-switcher" className="language-switcher" value={language} onChange={handleLanguageChange}>
                                    <option value="java">{"Java "}{javaCompleted ? "✔" : ""}</option>
                                    <option value="python">{"Python "}{pythonCompleted ? "✔" : ""}</option>
                                    <option value="javascript">{"JavaScript "}{javaScriptCompleted ? "✔" : ""}</option>
                                    <option value="typescript">{"TypeScript "}{typeScriptCompleted ? "✔" : ""}</option>
                                </select>
                            </>
                        )}
                        <div className="timer-span">{formatTime(currentTime)}</div>

                        <div className="editor-buttons">
                            <button className="action-button" onClick={() => setShowHelp(true)}>
                                <TbBulb />
                            </button>
                            <button className="action-button" onClick={saveCode}>Save</button>

                            {currentEditor === 'algorithm' && (
                                <>
                                    <button
                                        className="action-button"
                                        onClick={checkAlgorithm}
                                        disabled={algorithmLoading}
                                        style={{
                                            opacity: algorithmLoading ? 0.7 : 1,
                                            cursor: algorithmLoading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Validate Algorithm
                                    </button>
                                </>
                            )}

                            {currentEditor === 'pseudocode' && (
                                <>
                                    <button
                                        className="action-button"
                                        onClick={checkCode}
                                        disabled={checkLoading}
                                        style={{
                                            opacity: checkLoading ? 0.7 : 1,
                                            cursor: checkLoading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Validate
                                    </button>
                                </>
                            )}

                            {currentEditor === 'code' && (
                                <>
                                    <button
                                        className="action-button"
                                        onClick={CodeEditor}
                                        disabled={checkLoading}
                                        style={{
                                            opacity: checkLoading ? 0.7 : 1,
                                            cursor: checkLoading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        CheckCode
                                    </button>

                                    <button
                                        className="action-button"
                                        onClick={runCode}
                                        disabled={loading}
                                        style={{
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Run
                                    </button>

                                    <button
                                        className="action-button"
                                        onClick={submitCode}
                                        disabled={loading}
                                        style={{
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Submit
                                    </button>


                                    <button
                                        className="action-button"
                                        onClick={() => setShowPopup(true)}
                                        style={{ marginLeft: "10px" }}>Show Feedback</button>
                                    {showPopup && (
                                        <div
                                            style={{
                                                position: "fixed",
                                                top: 0,
                                                left: 0,
                                                width: "100vw",
                                                height: "100vh",
                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                zIndex: 1000,
                                            }}
                                            onClick={() => setShowPopup(false)}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: "#fff",
                                                    padding: "20px",
                                                    borderRadius: "10px",
                                                    width: "350px",
                                                    textAlign: "center",
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {passedCount > 0 ? (
                                                    <p style={{ color: "green", fontWeight: "bold" }}>
                                                        ✅ You passed {passedCount} test case{passedCount > 1 ? "s" : ""}!
                                                    </p>
                                                ) : (
                                                    <p style={{ color: "red", fontWeight: "bold" }}>
                                                        ❌ 0 test cases passed.
                                                    </p>
                                                )}
                                                <p style={{ marginTop: "10px", color: "#555" }}>
                                                    Feedback: “Your code looks clean, but optimize your loops.
                                                    need to improve in using the loops and condirion upadation”

                                                </p>
                                                <button
                                                    onClick={() => setShowPopup(false)}
                                                    style={{
                                                        marginTop: "15px",
                                                        padding: "6px 12px",
                                                        backgroundColor: "#FBB034",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >Close</button>
                                            </div>
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    </div>

                    {/* Editors Container */}
                    <div style={{ display: "flex", height: `${100 - bottomHeight}%` }}>
                        {currentEditor === 'algorithm' && (
                            <div className="editor-container" style={{ width: "100%" }}>
                                <div style={{ padding: "8px", background: "#1e1e1e", color: "#fff", fontSize: "16px", borderBottom: "1px solid #333", fontWeight: 700 }}>
                                    Algorithm Editor
                                </div>
                                <Editor
                                    height="calc(100% - 32px)"
                                    language="text"
                                    value={algorithm}
                                    theme="vs-dark"
                                    onChange={handleEditorChange3}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        wordWrap: "on",
                                        lineNumbers: "on",
                                    }}
                                />
                            </div>
                        )}
                        {currentEditor === 'pseudocode' && (
                            <div className="editor-container" style={{ width: "100%" }}>
                                <div style={{ padding: "8px", background: "#1e1e1e", color: "#fff", fontSize: "16px", borderBottom: "1px solid #333", fontWeight: 700 }}>
                                    Pseudocode Editor
                                </div>
                                <Editor
                                    height="calc(100% - 32px)"
                                    language="text"
                                    value={pseudoCode}
                                    theme="vs-dark"
                                    onChange={handleEditorChange2}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        wordWrap: "on",
                                        lineNumbers: "on",
                                    }}
                                />
                            </div>
                        )}
                        {currentEditor === 'code' && (
                            <div className="editor-container" style={{ width: "100%" }}>
                                <div style={{ padding: "8px", background: "#1e1e1e", color: "#fff", fontSize: "16px", borderBottom: "1px solid #333", fontWeight: 700 }}>
                                    {language === "java" ? "Java" : (language === 'python') ? 'Python' : (language === 'javascript') ? "JavaScript" : "TypeScript"} Code Editor
                                </div>
                                <Editor
                                    height="calc(100% - 32px)"
                                    options={{
                                        readOnly: false,
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        wordWrap: "on",
                                        lineNumbers: "on",
                                    }}
                                    language={language}
                                    value={code}
                                    theme="vs-dark"
                                    onChange={handleEditorChange1}
                                />
                            </div>
                        )}
                    </div>

                    {/* Horizontal Resizer */}
                    <div
                        className="vertical-resizer"
                        onMouseDown={handleMouseDown('vertical')}
                        style={{ cursor: 'ns-resize' }}
                    />


                    {feedback && (
                        <div
                            style={{
                                height: "100vh",
                                width: "100vw",
                                backdropFilter: "blur(4px)",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                position: "fixed",
                                top: 0,
                                left: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1000,
                            }}
                        >
                            <div
                                style={{
                                    position: "relative", // needed for absolute positioning of the button
                                    width: "350px",
                                    backgroundColor: "#f8f9fa",
                                    padding: "20px 15px 60px 15px", // bottom padding for the button
                                    borderRadius: "12px",
                                    textAlign: "center",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                    color: feedback.startsWith("✅") ? "green" : "red",
                                }}
                            >
                                {/* Heading */}
                                <h2 style={{ marginBottom: "15px" }}>{currentEditor === "algorithm" ? "Algorithm Validation" : (currentEditor === "psuedocode" ? "Pseudocode Validation" : "Code Validation")}</h2>

                                {/* Feedback Message */}
                                <p style={{ fontSize: "16px" }}>{feedback}</p>

                                {/* Close Button at bottom center */}
                                <button
                                    onClick={() => {
                                        setFeedback("");
                                        // (currentEditor == 'algorithm' && algorithmValidated) ? (setCurrentEditor('pseudocode') && pseudoValidated)?(setCurrentEditor('code')): setCurrentEditor('algorithm');
                                    }}
                                    style={{
                                        position: "absolute",
                                        bottom: "15px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        padding: "10px 20px",
                                        backgroundColor: "#dc3545", // red
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>)
                    }


                    {/* Input/Output Container */}
                    <div
                        className="input-output-container"
                        style={{ height: `${bottomHeight}%` }}
                    >
                        <div className="input-output-section">
                            <h3>Input</h3>
                            <textarea
                                className="input-textarea"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Enter input here"
                                style={{
                                    width: "100%",
                                    height: "calc(100% - 40px)",
                                    resize: "none",
                                    fontFamily: "monospace"
                                }}
                            />
                        </div>
                        {/* {feedback && (
              <div style={{
                height:"100vh",
                width:"100vw",
                backdropFilter:"10px",
                backgroundColor:"rgba(0,0,0,0.8)",
                position:"absolute",
                top:"0px",
                left:"0px",

              }}>
  <div
    style={{
      position:"absolute",
      zIndex:"1",
      left:"20vw",
      top:"25vh",
      border:"none",
      height:"maxContent",
      width:"20vw",
      display:"inline-block",
      backgroundColor: "#f8f9fa",
      padding: "10px",
      margin: "10px 0",
      color: feedback.startsWith("✅") ? "green" :
             feedback.startsWith("❌") ? "red" : "#333",
      borderRadius:"10px "
    }}
  >
    <button
    style={{
      marginTop:"-16px",
      float:"right",
      marginRight:"-20px",
      height:"10px",
      widows:"10px",
      background:"none",
    }}
    onClick={()=>setFeedback("")}>❌</button>
    <br />
   {feedback}
  </div>
  </div>
)} */}

                        <div className="input-output-section">
                            <h3>Output</h3>
                            <textarea
                                className="output-textarea"
                                value={output || ""}
                                readOnly
                                placeholder="Output will appear here after running the code"
                                style={{
                                    width: "100%",
                                    height: "calc(100% - 40px)",
                                    resize: "none",
                                    fontFamily: "monospace",
                                    backgroundColor: "#f8f9fa"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
};

export default Compiler;

