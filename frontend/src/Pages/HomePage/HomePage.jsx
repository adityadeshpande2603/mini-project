import { Link, Outlet } from "react-router-dom";
import TeacherStudentCard from "../../Components/TeacherStudentCard.jsx/TeacherStudentCard";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;


const HomePage = () => {

    return (
        <div className="relative h-screen w-screen">
            {/* Background Image */}
            <div
                className="bg-[url('/background.jpg')] bg-cover bg-center h-full w-full"
            ></div>


            <Link to="/">
                <img
                    src="/quiz.jpg"
                    alt="Quiz"
                    className="h-20 absolute left-7 top-7 z-10 "
                /></Link>



            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="title text-4xl font-bold text-black">ClassQuiz</div>
                <div className="tagLine text-3xl mt-2 text-black ">Quiz. Learn. Excel!!!</div>

                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default HomePage;