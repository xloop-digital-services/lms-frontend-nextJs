import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const Locations = [
  { id: 1, name: "Magnitude" },
  { id: 2, name: "Meteorite" },
  { id: 3, name: "Twilight" },
];

const BarChart = ({ barData }) => {
  // Extract labels: batch names and location names for each batch
  const labels = barData.map((data) => data.batch); // Only batch names


  // Ensure each batch contains data for all locations, even if some are missing in the response
  const getLocationData = (locations, locationId) => {
    const location = locations.find((loc) => loc.location_name === locationId);
    return location ? location.total_capacity : 0; // If no data, return 0 for that location
  };

  // Prepare datasets for each location and its capacity, instructors, and students
  const datasets = [
    {
      label: " Capacity",
      data: barData.map((data) => getLocationData(data.locations, 1)),
      backgroundColor: "#0074EE",
    },
    {
      label: "Magnitude",
      data: barData.map(
        (data) =>
          data.locations.find((loc) => loc.location_name === 1)
            ?.student_count || 0
      ),
      backgroundColor: "#18A07A",
    },
    {
      label: "Meteorite",
      data: barData.map(
        (data) =>
          data.locations.find((loc) => loc.location_name === 2)
            ?.student_count || 0
      ),
      backgroundColor: "#F29D41",
    },
    {
      label: "Twilight",
      data: barData.map(
        (data) =>
          data.locations.find((loc) => loc.location_name === 3)
            ?.student_count || 0
      ),
      backgroundColor: "#FF5733",
    },
  ];

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <div className="h-full">
        <Bar
          data={{
            labels, // Only batch names as labels
            datasets,
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false, // Hide X-axis grid lines
                },
                ticks: {
                  autoSkip: false, // Prevent skipping of ticks
                },
                barThickness: 40, // Adjust bar thickness
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
