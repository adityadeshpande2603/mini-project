import { useState, useEffect, useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import UpcomingQuiz from "../../Components/UpcomingQuiz/UpcomingQuiz";
import CreateQuiz from "../CreateQuiz/CreateQuiz";
import TeacherHomePageLeft from "../../Components/TeacherHomePageLeft/TeacherHomePageLeft";
import moment from "moment-timezone";
import { AuthContext } from "../../../lib/authContext/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const TeacherHomePage = () => {
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [quizzes, setQuizzes] = useState([]); // Store quizzes
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/auth/teacher/homepage/getquiz?teacherId=${currentUser.id}`, { withCredentials: true })
                setQuizzes(res.data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchQuizzes();
    }, []);
    const sortedQuizzes = [...quizzes].sort((a, b) => {
        const now = moment().tz("Asia/Kolkata");
        const startA = moment.tz(`${a.date} ${a.startTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");
        const endA = moment.tz(`${a.date} ${a.endTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");

        const startB = moment.tz(`${b.date} ${b.startTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");
        const endB = moment.tz(`${b.date} ${b.endTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata");

        // ✅ Check if quizzes are live
        const isLiveA = now.isBetween(startA, endA);
        const isLiveB = now.isBetween(startB, endB);

        if (isLiveA && !isLiveB) return -1; // A is live, move it up
        if (!isLiveA && isLiveB) return 1;  // B is live, move it up

        // ✅ If both are live, sort by nearest end time
        if (isLiveA && isLiveB) {
            return endA.diff(endB); // Live quiz with earlier end time comes first
        }

        // ✅ If both are upcoming, sort by nearest start time
        if (startA.isAfter(now) && startB.isAfter(now)) {
            return startA.diff(startB); // Upcoming quiz with earlier start time comes first
        }

        // ✅ If both have ended, sort by latest end time
        if (endA.isBefore(now) && endB.isBefore(now)) {
            return endB.diff(endA); // Ended quiz with later end time comes first
        }

        return 0; // Keep order unchanged
    });

    const handleShowCreateQuiz = () => {
        setShowCreateQuiz(true);
    };

    const handleHideCreateQuiz = () => {
        setShowCreateQuiz(false);
    };

    return (
        <div className="p-4 h-full w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center text-center border-black border-solid border-2">
                <Link to="/">
                    <img src="/quiz.jpg" alt="Quiz" className="h-20" />
                </Link>
                <div className="flex justify-end items-center">
                    <img
                        src="/plus.jpg"
                        alt="Create Quiz"
                        className="size-16 cursor-pointer"
                        onClick={handleShowCreateQuiz}
                    />
                    <img src="/Avatar.jpg" alt="User Avatar" className="size-16 rounded-full m-4" />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex justify-between h-[calc(100vh-5rem)] w-full">
                {/* Left Panel */}
                <div className="left border-black border-solid border-2 w-96 mt-1 h-full overflow-auto flex flex-col items-center">
                    <div className="flex items-center space-x-6 justify-center">
                        <div>Created Quiz</div>
                        <img
                            src="/plus.jpg"
                            className="size-16 cursor-pointer"
                            onClick={handleShowCreateQuiz}
                        />
                    </div>
                    <TeacherHomePageLeft />
                </div>

                {/* Middle Panel */}
                <div className={`middle h-full w-full flex flex-col overflow-auto ${showCreateQuiz ? "justify-center items-center" : "items-center"}`}>
                    <Outlet />
                    {showCreateQuiz && <CreateQuiz onClose={handleHideCreateQuiz} setShowCreateQuiz={setShowCreateQuiz} showCreateQuiz={showCreateQuiz} />}
                </div>

                {/* Right Panel - Upcoming Quizzes */}
                <div className="right border-black border-solid border-2 mt-1 h-full overflow-auto flex flex-col w-96">
                    {quizzes.length > 0 ? (
                        sortedQuizzes.map((quiz) => (
                            <UpcomingQuiz
                                key={quiz.id}
                                quizName={quiz.quizName}
                                date={quiz.date}
                                startTime={quiz.startTime}
                                endTime={quiz.endTime}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-4">No upcoming quizzes</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherHomePage;