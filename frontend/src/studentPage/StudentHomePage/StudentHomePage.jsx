import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../lib/authContext/AuthContext";
import StudentCard from "../../Components/StudentCard/StudentCard";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const StudentHomePage = () => {
    const [attempts, setAttempts] = useState([]);
    const [quizCode, setQuizCode] = useState(""); // State for input value
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!currentUser?.id) return;
            try {
                const res = await axios.get(
                    `${backendUrl}/api/auth/student/getstudentbyid?studentId=${currentUser.id}`,
                    { withCredentials: true }
                );
                setAttempts(res.data.attempts);
                console.log(res);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchQuizzes();
    }, [currentUser?.id]);

    if (!currentUser?.id) return <div>Loading...</div>;

    // Function to handle quiz attempt navigation
    const handleQuizAttempt = (e) => {
        e.preventDefault(); // Prevents form submission reload
        if (!quizCode.trim()) {
            alert("Please enter a quiz code.");
            return;
        }
        navigate(`/student/quiz/${quizCode}`);
    };

    return (
        <div className="p-4 h-full w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center text-center border-black border-solid border-2">
                <Link to="/">
                    <img src="/quiz.jpg" alt="Quiz" className="h-20" />
                </Link>
                <form 
                    className="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg justify-center"
                    onSubmit={handleQuizAttempt} // Attach function to form submission
                >
                    <h1 className="text-xl font-semibold text-gray-700 mx-3">Attempt Quiz</h1>

                    <input
                        type="text"
                        placeholder="Enter Quiz Code"
                        value={quizCode}
                        onChange={(e) => setQuizCode(e.target.value)} // Update state on input change
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mx-3"
                    />

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 mx-3"
                    >
                        Attempt
                    </button>
                </form>
            </div>

            {/* Quizzes Attempted */}
            <div className="flex flex-wrap">
                {attempts.length > 0 ? (
                    attempts.map((attempt, index) => (
                        <Link key={index} to={`/student/result/${attempt.quizId}/${attempt.id}`}>
                            <StudentCard
                                quizId={attempt.quizId}
                                score={attempt.score}
                            />
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-600 mt-4">No quiz attempts yet.</p>
                )}
            </div>
        </div>
    );
};

export default StudentHomePage;