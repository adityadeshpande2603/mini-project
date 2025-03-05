import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget/CloudinaryUploadWidget";
import ImagePopup from "../ImagePopUp/ImagePopup";

const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const Question = ({ divId, removeDiv, editQuestion, uploadedImage }) => {
    const { quizId } = useParams();
    const [questionId, setQuestionId] = useState(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        difficulty: "Easy",
        correctAnswer: ""
    });

    useEffect(() => {
        if (editQuestion) {
            setFormData({
                question: editQuestion.question || "",
                optionA: editQuestion.optionA || "",
                optionB: editQuestion.optionB || "",
                optionC: editQuestion.optionC || "",
                optionD: editQuestion.optionD || "",
                difficulty: editQuestion.difficulty || "Easy",
                correctAnswer: editQuestion.correctAnswer || ""
            });
            setQuestionId(editQuestion.id);
        }
    }, [editQuestion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxClick = (option) => {
        setFormData((prev) => ({
            ...prev,
            correctAnswer: prev[option],
        }));
    };

    const deleteQuestion = async () => {
        try {
            await axios.delete(`${backendUrl}/api/auth/teacher/homepage/deletequestion?questionId=${questionId}`, { withCredentials: true });
            removeDiv(divId);
        } catch (e) {
            console.log("Not able to delete question");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, images };

        try {
            if (questionId) {
                await axios.put(`${backendUrl}/api/auth/teacher/homepage/updatequestion`, { questionId, ...payload }, { withCredentials: true });
            } else {
                const res = await axios.post(`${backendUrl}/api/auth/teacher/homepage/createquestion?quizId=${quizId}`, payload, { withCredentials: true });
                if (res.data && res.data.id) setQuestionId(res.data.id);
            }
        } catch (e) {
            console.log("Error:", e);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-700">
            <form onSubmit={handleSubmit}>
                <div className="border border-gray-600 rounded-lg p-4 bg-gradient-to-r from-gray-800 to-gray-900">
                    {/* Image Section */}
                    {(uploadedImage?.length > 0 || images.length > 0) && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                            {[...(uploadedImage ?? []), ...(images ?? [])].map((image, index) => (
                                <ImagePopup key={index} index={index} image_url={image} />
                            ))}
                        </div>
                    )}

                    {/* Question Input */}
                    <div className="flex">
                        <textarea
                            name="question"
                            placeholder="Enter your question"
                            className="w-full h-14 p-2 bg-gray-700 text-white border border-gray-500 rounded-md mt-3 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                            rows={3}
                            value={formData.question}
                            onChange={handleChange}
                        />
                        {/* Difficulty Dropdown */}
                        <select
                            name="difficulty"
                            className="border border-gray-500 bg-gray-700 text-white rounded p-2 w-64 ml-3"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Options Section */}
                    <div className="mt-4">
                        {["optionA", "optionB", "optionC", "optionD"].map((option, index) => (
                            <div key={option} className={`flex items-center space-x-2 p-2 rounded-md ${(formData.correctAnswer === formData[option] && formData.correctAnswer !== "") ? "bg-green-600" : "bg-gray-800"}`}>
                                {/* Checkbox for Correct Answer */}
                                <div
                                    className="h-7 w-7 border-2 border-white cursor-pointer flex items-center justify-center text-white"
                                    onClick={() => handleCheckboxClick(option)}
                                >
                                    {formData.correctAnswer === formData[option] && "✓"}
                                </div>
                                {/* Option Input */}
                                <textarea
                                    name={option}
                                    placeholder={`Option ${index + 1}`}
                                    className="h-14 w-full p-2 bg-gray-700 text-white border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                    rows={3}
                                    value={formData[option]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-4">
                    <button type="submit" className="h-10 w-24 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                        {questionId ? "Update" : "Save"}
                    </button>
                    <button type="button" className="h-10 w-24 bg-red-500 text-white font-bold rounded-md ml-2 hover:bg-red-600" onClick={deleteQuestion}>
                        Remove
                    </button>
                </div>
            </form>

            {/* Image Upload Widget */}
            <CloudinaryUploadWidget
                uwConfig={{
                    cloudName: "adityadeshpande",
                    uploadPreset: "MiniProject",
                    multiple: true,
                    folder: "posts",
                    cropping: false,
                    quality: "auto",
                    format: "auto"
                }}
                setState={setImages}
            />
        </div>
    );
};

export default Question;
