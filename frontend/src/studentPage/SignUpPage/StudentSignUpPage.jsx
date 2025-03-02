import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";  // Make sure axios is imported
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;
const StudentSignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        school: "", // This is the field for the institute/school
        password: "",
        confirmPassword: "",
    });

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Log the form data (you can use this for API calls or validation)
        console.log(formData);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post(`${backendUrl}/api/auth/student/register`, {
                name: formData.fullName,
                email: formData.email,
                institute: formData.school, // Make sure to send the correct field here
                password: formData.password,
            });
            console.log(res);
            navigate("/student/signin");
        } catch (err) {
            console.error(err); // Log the entire error

        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="text-black flex flex-col border-2 border-black p-4 backdrop-blur-md bg-white/30"
            >
                <div className="flex justify-between mb-4">
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        id="fullName"
                        type="text"
                        className="border-2 border-gray-300 p-2"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex justify-between mb-4">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        className="border-2 border-gray-300 p-2"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex justify-between mb-4">
                    <label htmlFor="school">School/Institute Name:</label>
                    <input
                        id="school"
                        type="text"
                        className="border-2 border-gray-300 p-2"
                        value={formData.school}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex justify-between mb-4">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        className="border-2 border-gray-300 p-2"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex justify-between mb-4">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="border-2 border-gray-300 p-2"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2">
                    Submit
                </button>
                <div className="flex space-x-2">
                    <div>already have an account?</div>
                    <Link to="/student/signin">SignIn</Link>
                </div>
            </form>
        </div>
    );

}

export default StudentSignUpPage;