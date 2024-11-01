import React from "react";
import { Bar } from "react-chartjs-2";

const Locations = [
  { id: 1, name: "Magnitude" },
  { id: 2, name: "Meteorite" },
  { id: 3, name: "Twilight" },
];

const BarChart = ({ barData }) => {
  // Extract labels: batch names for each batch
  const labels = barData.map((data) => data.batch);

  // Ensure each batch contains data for all locations, even if some are missing in the response
  const getLocationData = (locations, locationId, field) => {
    const location = locations.find((loc) => loc.location_name === locationId);
    return location ? location[field] : 0; // If no data, return 0 for that location
  };

  // Prepare datasets for each location's capacity and student count
  const datasets = [
    {
      label: "Capacity - Magnitude",
      data: barData.map((data) => getLocationData(data.locations, 1, 'total_capacity')),
      backgroundColor: "#0074EE",
    },
    {
      label: "Students - Magnitude",
      data: barData.map((data) => getLocationData(data.locations, 1, 'student_count')),
      backgroundColor: "#18A07A",
    },
    {
      label: "Capacity - Meteorite",
      data: barData.map((data) => getLocationData(data.locations, 2, 'total_capacity')),
      backgroundColor: "#0074EE",
    },
    {
      label: "Students - Meteorite",
      data: barData.map((data) => getLocationData(data.locations, 2, 'student_count')),
      backgroundColor: "#FF5733",
    },
    {
      label: "Capacity - Twilight",
      data: barData.map((data) => getLocationData(data.locations, 3, 'total_capacity')),
      backgroundColor: "#0074EE", // Different color for clarity
    },
    {
      label: "Students - Twilight",
      data: barData.map((data) => getLocationData(data.locations, 3, 'student_count')),
      backgroundColor: "#E74C3C", // Different color for clarity
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }} className="scroller-thin">
      <div style={{ minWidth: barData.length * 100, height: "350px" }}>
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
                  display: true, // Hide X-axis grid lines
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