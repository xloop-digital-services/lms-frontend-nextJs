import React from "react";
import { Bar } from "react-chartjs-2";

const BarChartCourse = ({ barData }) => {
  const barThickness = typeof window !== "undefined" && window.innerWidth < 640 ? 30 : 100;

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
                label: "Background",
                data: [100, 100, 100, 100, 100, 100],
                backgroundColor: "#F6FBFD",
                barThickness: barThickness,
                categoryPercentage: 0.6,
                barPercentage: 0.7,
                order: 2,
              },
              {
                label: "Average Obtained Sum %",
                data: [
                  barData?.classes_percentage,
                  barData?.attendance_percentage,
                  barData?.avg_obtain_sum_assignments,
                  barData?.avg_obtain_sum_quizzes,
                  barData?.avg_obtain_sum_projects,
                  barData?.avg_obtain_sum_exams,
                ],
                backgroundColor: "#0074EE",
                barThickness: barThickness,
                categoryPercentage: 0.6,
                barPercentage: 0.7,
                order: 1,
                borderRadius: {
                  topLeft: 8,
                  topRight: 8,
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
              legend: {
                display: true,
                position: "bottom",
                labels: {
                  boxWidth: 12,
                  boxHeight: 12,
                  padding: 5,
                },
              },
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => tooltipItems[0].label,
                  label: (tooltipItem) => {
                    const dataIndex = tooltipItem.dataIndex;
                    const labels = [
                      "Classes",
                      "Attendance",
                      "Assignments",
                      "Quizzes",
                      "Projects",
                      "Exams",
                    ];
                    const detailsMap = {
                      0: [
                        `Total Classes: ${barData?.total_classes ?? "N/A"}`,
                        `Completed Classes: ${barData?.completed_classes ?? "N/A"}`,
                      ],
                      1: [
                        `Total Attendance: ${barData?.total_attendance ?? "N/A"}`,
                        `Present Attendance: ${barData?.total_present_attendance ?? "N/A"}`,
                      ],
                      2: [
                        `Obtained: ${(barData?.avg_obtain_sum_assignments ?? 0).toFixed(2)}`,
                        `Total: ${(barData?.avg_total_sum_assignments ?? 0).toFixed(2)}`,
                      ],
                      3: [
                        `Obtained: ${(barData?.avg_obtain_sum_quizzes ?? 0).toFixed(2)}`,
                        `Total: ${(barData?.avg_total_sum_quizzes ?? 0).toFixed(2)}`,
                      ],
                      4: [
                        `Obtained: ${(barData?.avg_obtain_sum_projects ?? 0).toFixed(2)}`,
                        `Total: ${(barData?.avg_total_sum_projects ?? 0).toFixed(2)}`,
                      ],
                      5: [
                        `Obtained: ${(barData?.avg_obtain_sum_exams ?? 0).toFixed(2)}`,
                        `Total: ${(barData?.avg_total_sum_exams ?? 0).toFixed(2)}`,
                      ],
                    };

                    let percentage = tooltipItem.raw ?? 0;

                    // Handling zero values for specific fields in tooltips
                    if (dataIndex === 2 && barData?.avg_obtain_sum_assignments === 0) {
                      percentage = 0;
                    }
                    if (dataIndex === 3 && barData?.avg_obtain_sum_quizzes === 0) {
                      percentage = 0;
                    }
                    if (dataIndex === 4 && barData?.avg_obtain_sum_projects === 0) {
                      percentage = 0;
                    }
                    if (dataIndex === 5 && barData?.avg_obtain_sum_exams === 0) {
                      percentage = 0;
                    }

                    // If both obtained and total are zero, show 0%
                    switch (dataIndex) {
                      case 2:
                        if (barData?.avg_obtain_sum_assignments === 0 && barData?.avg_total_sum_assignments === 0) {
                          percentage = 0;
                        }
                        break;
                      case 3:
                        if (barData?.avg_obtain_sum_quizzes === 0 && barData?.avg_total_sum_quizzes === 0) {
                          percentage = 0;
                        }
                        break;
                      case 4:
                        if (barData?.avg_obtain_sum_projects === 0 && barData?.avg_total_sum_projects === 0) {
                          percentage = 0;
                        }
                        break;
                      case 5:
                        if (barData?.avg_obtain_sum_exams === 0 && barData?.avg_total_sum_exams === 0) {
                          percentage = 0;
                        }
                        break;
                      default:
                        break;
                    }

                    const lines = [`${labels[dataIndex]}: ${percentage}%`, ...detailsMap[dataIndex]];
                    return lines;
                  },
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
