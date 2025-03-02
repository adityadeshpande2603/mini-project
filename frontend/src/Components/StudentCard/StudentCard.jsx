import axios from "axios";
import React, { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const StudentCard = ({ score, quizId }) => {

    const [quizName, setQuizName] = useState();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/auth/teacher/homepage/getquizbyid?quizId=${quizId}`, { withCredentials: true })
                // setQuizzes(res.data);
                console.log(res);

                setQuizName(res.data.quizName);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        fetchQuizzes();
    }, []);
    return (
        <div className="bg-white shadow-md rounded-lg p-4 w-80 mx-auto my-4 border border-gray-200 ">
            <h2 className="text-lg font-semibold text-gray-800">{quizName}</h2>
            <p className="text-gray-600 mt-2">Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
    );
};

export default StudentCard;