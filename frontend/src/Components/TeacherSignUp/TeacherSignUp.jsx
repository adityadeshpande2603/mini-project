import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const TeacherSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        school: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Clear error when user starts typing
        setErrors({ ...errors, [id]: "" });
    };

    // Validate form inputs
    const validateForm = () => {
        let newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.school.trim()) newErrors.school = "School/Institute name is required";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await axios.post(`${backendUrl}/api/auth/teacher/register`, {
                name: formData.fullName,
                email: formData.email,
                institute: formData.school,
                password: formData.password,
            });
            console.log(res);
            navigate("/teacher/signin");
        } catch (err) {
            console.error("Registration error:", err);
            setErrors({ ...errors, api: "Registration failed. Try again." });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="text-black flex flex-col border-2 border-black p-4 backdrop-blur-md bg-white/30">
                <div className="flex justify-between mb-4">
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        id="fullName"
                        type="text"
                        className="border-2 border-gray-300 p-2"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
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
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                    {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
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
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="flex justify-between  mb-4">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="border-2 border-gray-300 p-2"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                {errors.api && <p className="text-red-500 text-center">{errors.api}</p>}

                <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Submit</button>

                <div className="flex space-x-2 mt-2">
                    <div>Already have an account?</div>
                    <Link to="/teacher/signin" className="text-blue-700">Sign In</Link>
                </div>
            </form>
        </div>
    );
};

export default TeacherSignUp;