import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartCourse = ({ barData }) => {
  const totalWidth = 6 * 250;
  return (
    <div
      className="scrollbar-webkit overflow-x-auto"
      style={{ width: "100%", height: "315px" }}
    >
      <div className="h-full">

        <Bar
          data={{
            labels: [
              "Classes",
              "Attendance",
              "Assignments",
              "Quizzes",
              "Projects",
              "Exams",
            ],
            datasets: [
              {
                label: "Average Obtained Sum",
                data: [
                  barData.classes_percentage,
                  barData.attendance_percentage,
                  barData.avg_obtain_sum_assignments,
                  barData.avg_obtain_sum_quizzes,
                  barData.avg_obtain_sum_projects,
                  barData.avg_obtain_sum_exams,
                ],
                backgroundColor: "#0074EE",
                barThickness: 100,
                borderRadius: 5
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
                  title: (tooltipItems) => tooltipItems[0].label,
                  label: (tooltipItem) => {
                    const dataIndex = tooltipItem.dataIndex;

                    // Tooltip details for each category
                    const dataMapping = [
                      {
                        label: "Classes",
                        details: [
                          `Percentage: ${barData.classes_percentage.toFixed(
                            2
                          )}`,
                          `Total: ${barData.total_classes}`,
                          `Completed: ${barData.completed_classes}`,
                        ],
                      },
                      {
                        label: "Attendance",
                        details: [
                          `Percentage: ${barData.attendance_percentage.toFixed(
                            2
                          )}`,
                          `Total: ${barData.total_attendance}`,
                          `Present: ${barData.total_present_attendance}`,
                        ],
                      },
                      {
                        label: "Assignments",
                        details: [
                          `Percentage: ${barData.percentage_assignments.toFixed(
                            2
                          )}`,
                          `Highest Marks: ${barData.highest_obtain_sum_assignments.toFixed(
                            2
                          )}`,
                          `Lowest Marks: ${barData.lowest_obtain_sum_assignments.toFixed(
                            2
                          )}`,
                        ],
                      },
                      {
                        label: "Quizzes",
                        details: [
                          `Percentage: ${barData.percentage_quizzes.toFixed(
                            2
                          )}`,
                          `Highest Marks: ${barData.highest_obtain_sum_quizzes.toFixed(
                            2
                          )}`,
                          `Lowest Marks: ${barData.lowest_obtain_sum_quizzes.toFixed(
                            2
                          )}`,
                        ],
                      },
                      {
                        label: "Projects",
                        details: [
                          `Percentage: ${barData.percentage_projects.toFixed(
                            2
                          )}`,
                          `Highest Marks: ${barData.highest_obtain_sum_projects.toFixed(
                            2
                          )}`,
                          `Lowest Marks: ${barData.lowest_obtain_sum_projects.toFixed(
                            2
                          )}`,
                        ],
                      },
                      {
                        label: "Exams",
                        details: [
                          `Percentage: ${barData.percentage_exams.toFixed(2)}`,
                          `Highest Marks: ${barData.highest_obtain_sum_exams.toFixed(
                            2
                          )}`,
                          `Lowest Marks: ${barData.lowest_obtain_sum_exams.toFixed(
                            2
                          )}`,
                        ],
                      },
                    ];

                    const currentData = dataMapping[dataIndex];
                    return currentData.details;
                  },
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

export default BarChartCourse;
