import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const StudentProgressBarChart = ({
  courseProgress,
  quizProgress,
  assignmentProgress,
}) => {
  return (
    <div style={{ height: "260px" }}>
      <div className="h-full">
        <Bar
          data={{
            labels: ["Course", "Quiz", "Assignment"], // X-axis labels
            datasets: [
              {
                label: "Progress", // Label for the dataset
                data: [courseProgress, quizProgress, assignmentProgress], // Data corresponding to labels
                backgroundColor: ["#0074EE", "#F29D41", "#18A07A"], // Colors for each bar
              },
            ],
          }}
          options={{
            scales: {
              x: {
                grid: {
                  display: false, // Hide X-axis grid lines
                },
              },
              y: {
                beginAtZero: true,
                max: 100, // Set maximum value of Y-axis to 100
                title: {
                  display: true,
                  text: "Progress", // Y-axis label
                },
                ticks: {
                  // Only show ticks at 0, 50, and 100
                  stepSize: 20,
                  callback: function (value) {
                    return value + "%"; // Add "%" to Y-axis tick values
                  },
                },
                grid: {
                  display: false, // Hide Y-axis grid lines
                },
              },
            },
            plugins: {
              legend: {
                display: false, // Hide the legend
                position: "bottom", // Position the legend at the bottom
              },
            },
            maintainAspectRatio: false, // Disable aspect ratio to control height manually
          }}
        />
      </div>
    </div>
  );
};

export default StudentProgressBarChart;
