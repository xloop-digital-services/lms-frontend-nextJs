import React from "react";
import { Bar } from "react-chartjs-2";

const Locations = [
  { id: 1, name: "Magnitude" },
  { id: 2, name: "Meteorite" },
  { id: 3, name: "Twilight" },
];

const BarChart = ({ barData }) => {
  if (barData.length === 0) return null; // Handle case where no batch is selected

  const labels = barData[0].locations.map((location) => {
    const locationName = Locations.find(
      (loc) => loc.id === location.location_name
    )?.name;
    return locationName;
  });

  const datasets = [
    {
      label: "Capacity",
      data: barData[0].locations.map((location) => location.total_capacity),
      backgroundColor: "#0074EE",
    },
    {
      label: "Students",
      data: barData[0].locations.map((location) => location.student_count),
      backgroundColor: "#18A07A",
    },
  ];

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Bar
        data={{
          labels, // Location names as labels
          datasets,
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: false, // Show all labels
                maxRotation: 45,
                minRotation: 0,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
