import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
const backendUrl = import.meta.env.VITE_BACKEND_URL_PRODUCTION || import.meta.env.VITE_BACKEND_URL_LOCAL;

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const QuizBarGraph = () => {
    // Example data
    const data = {
        labels: ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4"], // Quiz names
        datasets: [
            {
                label: "Students Registered",
                data: [50, 40, 70, 60], // Number of students registered for each quiz
                backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bar
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
            {
                label: "Students Attempted",
                data: [45, 30, 65, 50], // Number of students who attempted each quiz
                backgroundColor: "rgba(255, 99, 132, 0.6)", // Red bar
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Quiz Performance (Registered vs Attempted)",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Quizzes",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Students",
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default QuizBarGraph;