import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const StudentResult = () => {
    const { quizId, attemptId } = useParams();  // Fetch attemptId from URL params
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [quizName, setQuizName] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const quizRes = await axios.get(
                    `${backendUrl}/api/auth/teacher/homepage/getquizbyid?quizId=${quizId}`,
                    { withCredentials: true }
                );

                const attemptRes = await axios.get(
                    `${backendUrl}/api/auth/teacher/homepage/getattemptbyid?attemptId=${attemptId}`,
                    { withCredentials: true }
                );

                console.log(attemptRes); `   `

                setQuizName(quizRes.data.quizName);
                setQuestions(quizRes.data.questions || []);
                setScore(attemptRes.data.score);

                // Store correct answers
                const answers = {};
                quizRes.data.questions.forEach((q) => {
                    answers[q.id] = q.correctAnswer;
                });
                setCorrectAnswers(answers);

                // Store student responses
                const studentResponses = {};
                attemptRes.data.responses.forEach((res) => {
                    studentResponses[res.questionId] = res.selectedAnswer;
                });
                setResponses(studentResponses);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, [quizId, attemptId]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-4">Quiz Results</h1>
            <h2 className="text-xl text-center">{quizName}</h2>
            <h3 className="text-lg text-center mt-2">Your Score: {score} / {questions.length}</h3>

            <div className="mt-6 border p-4 rounded-lg shadow-lg">
                {questions.map((question, index) => (
                    <div key={question.id} className="mb-4 p-4 border-b">
                        <p className="font-semibold">{index + 1}. {question.question}</p>
                        <div className="mt-2">
                            {["optionA", "optionB", "optionC", "optionD"].map((option) => (
                                <div key={option} className={`p-2 rounded-md 
                                    ${responses[question.id] === question[option] ? "bg-yellow-300" : ""}
                                    ${correctAnswers[question.id] === question[option] ? "bg-green-300" : ""}`}
                                >
                                    {question[option]}
                                </div>
                            ))}
                        </div>
                        <p className="mt-2">
                            ✅ Correct Answer: <span className="text-green-600 font-bold">{correctAnswers[question.id]}</span>
                        </p>
                        <p>
                            🏷️ Your Answer: <span className={`font-bold ${responses[question.id] === correctAnswers[question.id] ? "text-green-600" : "text-red-600"}`}>
                                {responses[question.id] || "Not Attempted"}
                            </span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <button className="px-6 py-3 bg-blue-500 text-white rounded" onClick={() => navigate("/student/homepage")}>
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default StudentResult;