import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const BarChart = ({ barData }) => {
  const barThickness = typeof window !== "undefined" && window.innerWidth < 640 ? 30 : 100;

  const totalWidth = barData.length * 250;
  return (
    <div
      className="scrollbar-webkit overflow-x-auto"
      style={{ width: "100%", height: "320px" }}
    >
      <div style={{ minWidth: `${totalWidth}px` }} className="h-full w-full">
        <Bar
          data={{
            labels: [
              "Classes",
              "Attendance",
              "Assignments",
              "Quizes",
              "Projects",
              "Exams",
            ],
            datasets: [
              {
                label: "Background",
                data: [100, 100, 100, 100, 100, 100],
                backgroundColor: "#F6FBFD",
                // borderRadius: 8,
                barThickness: barThickness,
                categoryPercentage: 0.6,
                barPercentage: 0.7,
                order: 2,

              },
              {
                label: "Percentage (%)",
                data: [
                  barData.classes_percentage,
                  barData.attendance_percentage,
                  barData.percentage_assignments,
                  barData.percentage_quizzes,
                  barData.percentage_projects,
                  barData.percentage_exams,
                ],
                backgroundColor: "#0074EE",
                barThickness: barThickness,
                categoryPercentage: 0.6,
                barPercentage: 0.7,
                order: 1,
                borderRadius: {
                  topLeft: 8,
                  topRight: 8
                },
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                grid: { display: false },
                ticks: { autoSkip: false },
              },
              y: {
                beginAtZero: true,
                max: 100,
                stacked: false,
                title: {
                  display: true,
                  text: "Average Obtained Sum",
                },
                ticks: {
                  stepSize: 20,
                  callback: (value) => `${value}`,
                },
                grid: {
                  display: true,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    return tooltipItems[0].label;
                  },
                  label: (tooltipItem) => {
                    const dataIndex = tooltipItem.dataIndex;
                    const dataMapping = [
                      {
                        label: "Classes",
                        percentage: barData.classes_percentage,
                        details: [
                          `Total Classes: ${barData.total_classes}`,
                          `Completed Classes: ${barData.completed_classes}`,
                        ],
                      },
                      {
                        label: "Attendance",
                        percentage: barData.attendance_percentage,
                        details: [
                          `Total Attendance: ${barData.total_attendance}`,
                          `Present: ${barData.total_present_attendance}`,
                        ],
                      },
                      {
                        label: "Assignments",
                        percentage: barData.percentage_assignments,
                        details: [
                          `Obtained: ${(barData.avg_obtain_sum_assignments ?? 0).toFixed(2)}`,
                          `Total: ${(barData.avg_total_sum_assignments ?? 0).toFixed(2)}`,
                        ],
                      },
                      {
                        label: "Quizzes",
                        percentage: barData.percentage_quizzes,
                        details: [
                          `Obtained: ${(barData.avg_obtain_sum_quizzes ?? 0).toFixed(2)}`,
                          `Total: ${(barData.avg_total_sum_quizzes ?? 0).toFixed(2)}`,
                        ],
                      },
                      {
                        label: "Projects",
                        percentage: barData.percentage_projects,
                        details: [
                          `Obtained: ${(barData.avg_obtain_sum_projects ?? 0).toFixed(2)}`,
                          `Total: ${(barData.avg_total_sum_projects ?? 0).toFixed(2)}`,
                        ],
                      },
                      {
                        label: "Exams",
                        percentage: barData.percentage_exams,
                        details: [
                          `Obtained: ${(barData.avg_obtain_sum_exams ?? 0).toFixed(2)}`,
                          `Total: ${(barData.avg_total_sum_exams ?? 0).toFixed(2)}`,
                        ],
                      },
                    ];

                    return dataMapping[dataIndex];
                  }

                },
              },
              legend: {
                display: true,
                position: "bottom",
                align: "center",
                labels: {
                  boxWidth: 15,
                  boxHeight: 15,
                  padding: 7,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;