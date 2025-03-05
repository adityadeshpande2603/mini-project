import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ImagePopup from "../../Components/ImagePopUp/ImagePopup";

const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const StudentResult = () => {
    const { quizId, attemptId, isteacher } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [rank, setRank] = useState(0);
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

                try {
                    const rankRes = await axios.get(
                        `${backendUrl}/api/auth/teacher/homepage/getattemptbyrank?attemptId=${attemptId}&quizId=${quizId}`,
                        { withCredentials: true }
                    );
                    setRank(rankRes.data.rank);
                } catch (e) {
                    console.log(e);
                }

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
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-4 text-yellow-400">Quiz Results</h1>
            <h2 className="text-xl text-center text-gray-300">{quizName}</h2>
            <h3 className="text-lg text-center mt-2 text-gray-400">
                Your Score: <span className="font-bold text-yellow-400">{score} / {questions.length}</span>
            </h3>
            <h3 className="text-lg text-center mt-2 text-gray-400">
                Your Rank: <span className="font-bold text-yellow-400">{rank}</span>
            </h3>

            <div className="mt-6 border border-gray-700 p-4 rounded-lg shadow-lg bg-gray-800">
                {questions.map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border-b border-gray-700">
                        <div className="flex flex-wrap gap-4">
                            {question.images?.map((image, idx) => (
                                <ImagePopup key={idx} index={idx} image_url={image} />
                            ))}
                        </div>
                        <p className="font-semibold text-gray-200">{index + 1}. {question.question}</p>
                        <div className="mt-2">
                            {["optionA", "optionB", "optionC", "optionD"].map((option) => (
                                <div 
                                    key={option} 
                                    className={`p-2 rounded-md my-1 transition 
                                        ${
                                            responses[question.id] === question[option] && correctAnswers[question.id] !== question[option]
                                                ? "bg-red-600 text-white"
                                                : ""
                                        } 
                                        ${
                                            correctAnswers[question.id] === question[option]
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-700 text-gray-300"
                                        }`}
                                >
                                    {question[option]}
                                </div>
                            ))}
                        </div>
                        <p className="mt-2">
                            ✅ Correct Answer: <span className="text-green-400 font-bold">{correctAnswers[question.id]}</span>
                        </p>
                        <p>
                            🏷️ Your Answer: 
                            <span 
                                className={`font-bold ml-2 ${
                                    responses[question.id] === correctAnswers[question.id]
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {responses[question.id] || "Not Attempted"}
                            </span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <button 
                    className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600 transition duration-200"
                    onClick={() => { isteacher === "true" ? navigate("/teacher/homepage") : navigate("/student/homepage") }}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default StudentResult;
