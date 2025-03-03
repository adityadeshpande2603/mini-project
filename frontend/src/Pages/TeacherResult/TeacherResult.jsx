import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const TeacherResult = () => {
    const { quizId } = useParams();
    const [quizName, setQuizName] = useState("");
    const [attempts, setAttempts] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(
                    `${backendUrl}/api/auth/teacher/homepage/getquizbyid?quizId=${quizId}`,
                    { withCredentials: true }
                );

                setQuizName(res.data.quizName);

                // Fetch student names for each attempt
                const attemptsWithNames = await Promise.all(
                    res.data.attempts.map(async (attempt) => {
                        try {
                            const studentRes = await axios.get(
                                `${backendUrl}/api/auth/student/getstudentbyid?studentId=${attempt.studentId}`,
                                { withCredentials: true }
                            );

                            return {
                                ...attempt,
                                studentName: studentRes.data.name || "Unknown",
                            };
                        } catch (error) {
                            console.error("Error fetching student details:", error);
                            return { ...attempt, studentName: "Unknown" };
                        }
                    })
                );

                console.log("Resolved Attempts:", attemptsWithNames);
                setAttempts(attemptsWithNames);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        fetchQuiz();
    }, [quizId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4">{quizName} - Student Results</h1>
            
            {attempts.length > 0 ? (
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-4 py-2">Student ID</th>
                            <th className="border border-gray-400 px-4 py-2">Student Name</th>
                            <th className="border border-gray-400 px-4 py-2">Score</th>
                            <th className="border border-gray-400 px-4 py-2">Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempts.map((attempt, index) => (
                            <tr key={index} 
                            className="text-center hover:cursor-pointer hover:bg-yellow-100" 
                            onClick={() => navigate(`/student/result/${quizId}/${attempt.id}`)}
                        >
                                <td className="border border-gray-400 px-4 py-2">{attempt.studentId}</td>
                                <td className="border border-gray-400 px-4 py-2">{attempt.studentName}</td>
                                <td className="border border-gray-400 px-4 py-2">{attempt.score}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    {attempt.submitted ? "✅ Yes" : "❌ No"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600 mt-4">No students have attempted this quiz yet.</p>
            )}
        </div>
    );
};

export default TeacherResult;