import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const BarChart = ({
  barData,
  barPercentage = 0.6,
  categoryPercentage = 0.6,
}) => {
  const labels = [
    "Classes",
    "Attendance",
    "Assignments",
    "Quizes",
    "Projects",
    "Exams",
  ];

  // actual % values
  const dataValues = [
    barData.classes_percentage,
    barData.attendance_percentage,
    barData.percentage_assignments,
    barData.percentage_quizzes,
    barData.percentage_projects,
    barData.percentage_exams,
  ];

  // remainder = 100 − actual
  const remainder = dataValues.map((v) => 100 - v);

  return (
    <div className="w-full h-[420px]">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Progress",
              data: dataValues,
              backgroundColor: "#006FF0",      // filled part
              barPercentage,
              categoryPercentage,
            },
            {
              label: "Remaining",
              data: remainder,
              backgroundColor: "#F6FBFD",      // empty part
              barPercentage,
              categoryPercentage,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,       // ← stack bars
              grid: { display: false },
              ticks: { autoSkip: false },
            },
            y: {
              stacked: true,       // ← stack bars
              beginAtZero: true,
              // min: 0,
              suggestedMin : 0,
              max: 100,
              title: { display: true, text: "Progress" },
              ticks: {
                stepSize: 20,
                callback: (v) => v + "%",
              },
              grid: { display: true },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                // sirf Progress (first dataset) ka tooltip dikhayein
                label: (ctx) => {
                  if (ctx.datasetIndex === 0) {
                    return `Progress: ${ctx.parsed.y}%`;
                  }
                  return null;
                },
              },
            },
            legend: {
              display: false,   // ab do legend nahi chahiye
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
