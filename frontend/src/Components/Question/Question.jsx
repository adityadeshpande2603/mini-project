import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget/CloudinaryUploadWidget";
import ImagePopup from "../ImagePopUp/ImagePopup";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const Question = ({ divId, removeDiv, addDiv, editQuestion, uploadedImage }) => {
    const { quizId } = useParams();
    const [questionId, setQuestionId] = useState(null);
    const [images, setImages] = useState([]);

    const [formData, setFormData] = useState({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        difficulty: "",
        correctAnswer: ""
    });

    useEffect(() => {
        if (editQuestion) {
            console.log("editquestion", editQuestion);
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

    const deleteQuestion = async (questionId) => {

        try {

            await axios.delete(`${backendUrl}/api/auth/teacher/homepage/deletequestion?questionId=${questionId}`, { withCredentials: true });

            console.log("deleted successfully")
            removeDiv(divId);
        }
        catch (e) {
            console.log("not able to delete question")
        }

    }
    const payload = {
        ...formData,
        images // Include uploaded image URLs in request
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);

        if (questionId) {
            try {
                await axios.put(`${backendUrl}/api/auth/teacher/homepage/updatequestion`, {
                    questionId,
                    ...payload
                }, { withCredentials: true });
                console.log("Question Updated!");
            } catch (e) {
                console.log("Update failed:", e);
            }
        } else {
            try {
                const res = await axios.post(
                    `${backendUrl}/api/auth/teacher/homepage/createquestion?quizId=${quizId}`,
                    payload,
                    { withCredentials: true }
                );
                console.log("Success:", res.data);
                if (res.data && res.data.id) setQuestionId(res.data.id);
            } catch (e) {
                console.log("Error:", e);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="border-solid border-black border-2 rounded-2xl mt-4 p-4">
                    {(uploadedImage?.length > 0 || images.length > 0) && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                            {[...(uploadedImage ?? []), ...(images ?? [])].map((image, index) => (
                                // <img key={index} src={image} alt={`Uploaded ${index + 1}`} className="h-48  object-cover rounded-md border" />
                                <ImagePopup index={index} image_url={image}   ></ImagePopup>
                            ))}
                        </div>
                    )}
                    <div className="flex">
                        <textarea
                            name="question"
                            placeholder="Quiz Question"
                            className="w-full h-14 p-2 border border-gray-300 rounded-md mt-3"
                            rows={3}
                            value={formData.question}
                            onChange={handleChange}
                        />
                        <select
                            name="difficulty"
                            className="border border-gray-300 rounded p-2 w-64 ml-3"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>



                    {/* Options Section */}
                    <div className="options mt-4">
                        {["optionA", "optionB", "optionC", "optionD"].map((option, index) => (
                            <div key={option} className={`flex items-center space-x-2 p-2 
                                ${(formData.correctAnswer === formData[option] && formData.correctAnswer != "") ? "bg-green-500" : ""}`}>
                                <div className="h-7 w-7 border-black border-2 cursor-pointer"
                                    onClick={() => handleCheckboxClick(option)}>
                                </div>
                                <textarea
                                    name={option}
                                    placeholder={`Option ${index + 1}`}
                                    className="h-14 w-full p-2 border border-gray-300 rounded-md"
                                    rows={3}
                                    value={formData[option]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end">
                    <button type="submit" className="h-10 w-20 bg-blue-500 m-4 text-white">
                        {questionId ? "Update" : "Save"}
                        {/* {console.log(questionId,"aasdad")}; */}
                    </button>
                    <button type="button" className="h-10 w-20 bg-red-500 m-4 text-white" onClick={() => deleteQuestion(questionId)}>
                        Remove
                    </button>
                </div>
            </form >
            <CloudinaryUploadWidget
                uwConfig={{
                    cloudName: "adityadeshpande",
                    uploadPreset: "MiniProject",
                    multiple: true,
                    folder: "posts",
                    cropping: false,
                    quality: "auto",
                    format: "auto"
                }} setState={setImages}></CloudinaryUploadWidget>
        </div >
    );
};

export default Question;