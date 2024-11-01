import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import cityAreas from "../../public/data/cityAreas.json";

const BarChart = ({ barData }) => {
  return (
    <div style={{ height: "350px", width: "100%" }}>
      <div className="h-full">
        {" "}
        {/* Ensure enough space for horizontal scrolling */}
        <Bar
          data={{
            labels: cityAreas.map((city) => city.name),
            datasets: [
              {
                label: "Capacity",
                data: barData.map((data) => data.total_capacity),
                backgroundColor: "#0074EE",
              },
              {
                label: "Instructors",
                data: barData.map((data) => data.instructor_count),
                backgroundColor: "#F29D41",
              },
              {
                label: "Students",
                data: barData.map((data) => data.student_count),
                backgroundColor: "#18A07A",
              },
              // {
              //   label: "Guest",
              //   data: [120],
              //   backgroundColor: "#18A07A",
              // },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false, // Hide X-axis grid lines
                },
                ticks: {
                  autoSkip: false, // Prevent skipping of ticks to ensure all labels are shown
                },
                barThickness: 50, // Adjust bar thickness to fit more bars if necessary
              },
              y: {
                grid: {
                  display: false, // Hide Y-axis grid lines
                },
              },
            },
            plugins: {
              legend: {
                display: true, // Show the legend
                position: "bottom", // Position the legend at the bottom
                labels: {
                  boxWidth: 40, // Width of the color box
                  boxHeight: 5,
                  padding: 20, // Padding between the legend and chart
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
