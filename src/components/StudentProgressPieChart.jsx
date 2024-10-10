import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const StudentProgressPieChart = ({
  courseProgress,
  quizProgress,
  assignmentProgress,
}) => {
  return (
    <div
      style={{ height: "270px", width: "100%" }}
      className="flex justify-center items-center mt-4"
    >
      <Doughnut
        data={{
          labels: ["Course", "Quiz", "Assignment"],
          datasets: [
            {
              data: [courseProgress, quizProgress, assignmentProgress],
              backgroundColor: ["#0074EE", "#D0E9F8", "#8BB8FF"],
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: true, // Show the legend
              position: "bottom", // Position the legend at the bottom
              labels: {
                boxWidth: 20, // Width of the color box
                padding: 10, // Padding between the legend and chart
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const value = data.datasets[0].data[i]; // Get the progress value
                      return {
                        text: `${label}: ${value}%`, // Append '%' to the progress value
                        fillStyle: data.datasets[0].backgroundColor[i], // Color for the legend
                        strokeStyle: data.datasets[0].backgroundColor[i],
                        hidden: false,
                        index: i,
                      };
                    });
                  }
                  return [];
                },
              },
            },
          },
          // maintainAspectRatio: false, // Uncomment if you need to maintain the aspect ratio
        }}
      />
    </div>
  );
};

export default StudentProgressPieChart;
