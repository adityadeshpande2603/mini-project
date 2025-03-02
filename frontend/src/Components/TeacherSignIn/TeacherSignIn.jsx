import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"
import { AuthContext } from "../../../lib/authContext/AuthContext.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

const TeacherSignIn = () => {

    const { currentUser, setCurrentUser, updateUser } = useContext(AuthContext);


    let location = useLocation();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        email: "",

        password: "",

    });
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Log the form data (you can use this for API calls or validation)
        console.log(formData);



        try {
            const res = await axios.post(`${backendUrl}/api/auth/teacher/login`, {
                email: formData.email,
                password: formData.password,
            }, {
                withCredentials: true,  // This ensures the cookie is sent
            });
            console.log(res.data);
            updateUser(res.data);
            console.log("login", currentUser);
            navigate("/teacher/homepage");
        } catch (err) {
            console.error(err); // Log the entire error

        }
    };


    return (
        <div>
            {console.log(location)}
            <form action="" onSubmit={handleSubmit} className="text-black flex flex-col border-2 border-black p-4 backdrop-blur-md bg-white/30">

                <div className="flex justify-between mb-4">
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" className="border-2 border-gray-300 p-2"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex justify-between mb-4">
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" className="border-2 border-gray-300 p-2"
                        value={formData.password}
                        onChange={handleInputChange} />
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2">Submit</button>
                <div className="flex space-x-2">
                    <div>don't have an account?</div>
                    <Link to="/teacher/register">SignUp</Link>
                </div>
            </form>

        </div>
    )


}

export default TeacherSignIn;