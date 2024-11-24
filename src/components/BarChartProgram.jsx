import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const BarChart = ({ barData }) => {
  // console.log(barData.length,'length')

  const totalWidth = barData.length * 250;
  return (
    <div
      className="scrollbar-webkit overflow-x-auto"
      style={{ width: "100%", height: "350px" }}
    >
      <div style={{ minWidth: `${totalWidth}px` }} className="h-full w-full">
        <Bar
          data={{
            labels: barData.map((data) => {
              const course = data.session_details.course;
              const location = data.session_details.location;
              const startDate = data.session_details.start_date;
              const endDate = data.session_details.end_date;

              // Use line breaks for multi-line labels
              return `${course}\n ${location}\n(${startDate} - ${endDate})`;
            }),
            datasets: [
              {
                label: "Progress Percentage",
                data: barData.map((data) => data.percentage),
                backgroundColor: "#0074EE",
                barThickness: 30,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  autoSkip: false, // Prevent skipping of ticks to show all labels
                  font: {
                    // size: 10,
                  },
                  callback: function (value) {
                    return this.getLabelForValue(value).split("\n");
                  },
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
                  display: true, // Hide Y-axis grid lines
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    // Show the label (e.g., course and location)
                    return tooltipItems[0].label;
                  },
                  label: (tooltipItem) => {
                    const dataIndex = tooltipItem.dataIndex;
                    const currentData = barData[dataIndex];
                    return [
                      `Progress: ${currentData.percentage}%`,
                      `Total Classes: ${currentData.total_classes}`,
                      `Completed Classes: ${currentData.completed_classes}`,
                    ];
                  },
                },
              },
              legend: {
                display: true,
                position: "top",
                align: "center",
                labels: {
                  boxWidth: 40,
                  boxHeight: 5,
                  padding: 10, // Padding between the legend and chart
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