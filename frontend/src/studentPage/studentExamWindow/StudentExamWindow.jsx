import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../lib/authContext/AuthContext";
import ImagePopup from "../../Components/ImagePopUp/ImagePopup";

const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const StudentExamWindow = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const [correctCount, setCorrectCount] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [correctAnswer, setCorrectAnswer] = useState({});
    const [quizName, setQuizName] = useState("");
    const [active, setActive] = useState(true);

    useEffect(() => {
        const fetchDecryptedQuestions = async () => {
            if (active) {
                try {
                    const response = await axios.post(
                        `${backendUrl}/api/auth/rsa/decryptpaper`,
                        { quizId },
                        { withCredentials: true }
                    );

                    const questionsData = response.data;
                    setQuestions(questionsData);

                    const answers = {};
                    questionsData.forEach((question) => {
                        answers[question.questionId] = question.correctAnswer;
                    });
                    setCorrectAnswer(answers);

                } catch (error) {
                    console.error("Failed to decrypt quiz paper:", error);
                }
            }
        };

        fetchDecryptedQuestions();
    }, [active]);

    const handleOptionSelect = (questionId, selectedOption) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmit = async () => {
        if (!window.confirm("Are you sure you want to submit the quiz?")) return;

        try {
          

            let correctCountTemp = 0;

            // console.log("res",res);

            const updatedQuestions = questions.map((q) => {
                const isCorrect = responses[q.questionId] === correctAnswer[q.questionId];
                console.log(responses[q.questionId], correctAnswer[q.questionId]);
            
                if (isCorrect) correctCountTemp++;
            
                return { ...q, isCorrect, "selectedOption" : responses[q.questionId] };
            });


            console.log(updatedQuestions);

            // for (const key of Object.keys(responses)) {
                
              
            // //  console.log(res.data.id,key,responses[key],isCorrect)
            //     try {
            //         await axios.post(
            //             `${backendUrl}/api/auth/teacher/homepage/createresponse?quizId=${quizId}`,
            //             {
            //                 // attemptId: res.data.id,
            //                 questionId: key,
            //                 selectedAnswer: responses[key],
            //                 isCorrect: isCorrect,
            //             },
            //             { withCredentials: true }
            //         );
            //     } catch (e) {
            //         console.log(`Error submitting response for ${key}:`, e);
            //     }
            // }

            setCorrectCount(correctCountTemp);



            // await axios.put(
            //     `${backendUrl}/api/auth/teacher/homepage/updateattempt`,
            //     { attemptId: res.data.id, score: correctCountTemp },
            //     { withCredentials: true }
            // );

            try {
                await axios.post(`${backendUrl}/api/auth/rsa/uploadresponse`, {
                    quizId,
                    studentId: currentUser.id,
                    response: updatedQuestions
                }, { withCredentials: true });
            
                console.log("Responses uploaded successfully.");
            } catch (error) {
                console.error("Failed to upload responses:", error.response?.data || error.message);
            }

            alert("Quiz Submitted Successfully!");
            navigate(`/student/result/${quizId}/${currentUser.id}/false`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="exam-container flex flex-col h-screen bg-blue-950 bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="flex justify-between items-center px-6 py-3 bg-gray-800">
                <h2 className="text-lg font-bold">{quizName}</h2>
                <h2 className="text-lg font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                <button
                    className="quiz-button bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

            <div className="flex flex-1">
                {/* Navigation Panel */}
                <div className="w-1/4 p-4 border-r bg-gray-800 space-y-3">
                    <h2 className="text-xl font-bold mb-4">Quiz Navigation</h2>
                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, i) => (
                            <button
                                key={q.questionId}
                                className={`p-2 text-white rounded ${responses[q.questionId] ? "bg-green-500" : "bg-gray-500"}`}
                                onClick={() => setCurrentQuestionIndex(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-3/4 p-6 flex flex-col overflow-auto h-[90vh]">
                    {currentQuestion ? (
                        <>
                            <h2 className="text-xl font-bold mb-2">Question {currentQuestionIndex + 1}</h2>
                            <p className="mb-4 text-lg">{currentQuestion.question}</p>

                            {/* Images */}
                            <div className="flex flex-wrap">
                                {currentQuestion.images?.map((image, index) => (
                                    <ImagePopup key={index} index={index} image_url={image} />
                                ))}
                            </div>

                            {/* Options */}
                            <div className="options space-y-3 mt-4">
                                {["optionA", "optionB", "optionC", "optionD"].map((optionKey) => (
                                    <button
                                        key={optionKey}
                                        className={`w-full p-3 text-left border rounded-md text-black transition duration-300 ease-in-out hover:bg-gradient-to-r from-green-600 to-green-800 ${
                                            responses[currentQuestion.questionId] === currentQuestion[optionKey]
                                                ? "bg-gradient-to-r from-green-600 to-green-800 text-white"
                                                : "bg-white"
                                        }`}
                                        onClick={() => handleOptionSelect(currentQuestion.questionId, currentQuestion[optionKey])}
                                    >
                                        {currentQuestion[optionKey]}
                                    </button>
                                ))}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-6">
                                <button
                                    className={`px-6 py-3 rounded-lg font-semibold text-white transition duration-300 ease-in-out shadow-md ${
                                        currentQuestionIndex === 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700 active:scale-95 focus:ring-2 focus:ring-purple-400"
                                    }`}
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                >
                                    Previous
                                </button>

                                <button
                                    className={`px-6 py-3 rounded-lg font-semibold text-white transition duration-300 ease-in-out shadow-md ${
                                        currentQuestionIndex === questions.length - 1
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 active:scale-95 focus:ring-2 focus:ring-blue-400"
                                    }`}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-xl">Loading question...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentExamWindow;