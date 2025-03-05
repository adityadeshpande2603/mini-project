import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../lib/authContext/AuthContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const TeacherSignIn = () => {
    const { currentUser, setCurrentUser, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email format";
            isValid = false;
        }

        if (!formData.password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await axios.post(
                `${backendUrl}/api/auth/teacher/login`,
                {
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            updateUser(res.data);
            console.log("Login successful:", res.data);
            navigate("/teacher/homepage");
        } catch (err) {
            console.error("Login failed:", err);
            setErrors({ apiError: "Invalid email or password" });
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="text-black flex flex-col border-2 border-black p-4 backdrop-blur-md bg-white/30"
            >
                <div className="flex flex-col mb-4">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        className="border-2 border-gray-300 p-2"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>

                <div className="flex flex-col mb-4">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        className="border-2 border-gray-300 p-2"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                </div>

                {errors.apiError && <div className="text-red-500 mb-4">{errors.apiError}</div>}

                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                    Sign In
                </button>

                <div className="flex space-x-2 mt-2">
                    <span>Don't have an account?</span>
                    <Link to="/teacher/register" className="text-blue-500">
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default TeacherSignIn;