import { useEffect, useState } from "react";
import Question from "../../Components/Question/Question";
import { useParams } from "react-router-dom";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const QuizQuestion = () => {
    const { quizId } = useParams();
    const [quizName, setQuizName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [questions, setQuestions] = useState([]); // ✅ Store fetched questions

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(
                    `${backendUrl}/api/auth/teacher/homepage/getquizbyid?quizId=${quizId}`,
                    { withCredentials: true }
                );

                setQuizName(res.data.quizName);
                setQuestions(res.data.questions || []); // ✅ Store existing questions
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(
                `${backendUrl}/api/auth/teacher/homepage/updatequizname?quizId=${quizId}`,
                { quizName },
                { withCredentials: true }
            );
            console.log("Quiz name updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating quiz name:", error);
        }
    };

    const addQuestion = () => {
        setQuestions((prevQuestions) => [...prevQuestions, { fakeId: Date.now() }]);


    };

    const removeQuestion = (questionId) => {
        setQuestions(questions.filter((q) => q.id !== questionId));
    };

    return (
        <div className="w-full p-3">
            {/* ✅ Quiz Name Section */}
            <div className="quizName border-solid border-black border-2 w-full h-40 rounded-2xl p-4">
                <h1 className="font-bold text-4xl my-4">Quiz Name</h1>

                {/* ✅ Toggle between text and textarea */}
                {isEditing ? (
                    <textarea
                        className="w-full h-14 p-2 border border-gray-300 rounded-md"
                        rows={3}
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                    />
                ) : (
                    <p className="text-lg font-medium">{quizName || "No name set"}</p>
                )}
            </div>

            {/* ✅ Edit & Save Buttons */}
            <div className="mt-2">
                {isEditing ? (
                    <button
                        className="h-10 w-20 bg-green-500 text-white rounded-md"
                        onClick={handleSaveClick}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="h-10 w-20 bg-blue-500 text-white rounded-md"
                        onClick={handleEditClick}
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* ✅ Question Section (Rendering Existing & New Questions) */}
            <div className="questions overflow-auto">
                {questions.map((question) => (
                    <Question
                        key={question.fakeId}
                        divId={question.id}
                        removeDiv={removeQuestion}
                        addDiv={addQuestion}
                        editQuestion={question} // ✅ Prefill existing question data
                    />
                ))}

                {/* ✅ Add Question & Create Quiz Buttons */}
                <div className="flex items-center justify-center">
                    <button className="h-10 w-36 bg-green-500 m-4" onClick={addQuestion}>
                        Add Question
                    </button>

                </div>
            </div>
        </div>
    );
};

export default QuizQuestion;