import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../lib/authContext/AuthContext";
import StudentCard from "../../Components/StudentCard/StudentCard";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const StudentHomePage = () => {
    const [attempts, setAttempts] = useState([]);
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
                console.log(res)
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchQuizzes();
    }, [currentUser?.id]); // ✅ Added dependency

    if (!currentUser?.id) return <div>Loading...</div>;

    return (
        <div className="p-4 h-full w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center text-center border-black border-solid border-2">
                <Link to="/">
                    <img src="/quiz.jpg" alt="Quiz" className="h-20" />
                </Link>
            </div>

            {/* Quizzes Attempted */}
            <div>
                {attempts.length > 0 ? (
                    attempts.map((attempt, index) => (
                        <Link to={`/student/result/${attempt.quizId}/${attempt.id}`}>
                            <StudentCard
                                key={index}
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