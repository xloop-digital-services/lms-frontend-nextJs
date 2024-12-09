import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const PieChart = ({verified, unverified, pending, shortlisted}) => {
  return (
    <div
      style={{ height: "320px", width: "100%" }}
      className="flex justify-center items-center mt-4"
    >
      <Doughnut
        data={{
          labels: ["Verified", 'Unverified', "Pending", "Shortlist"],
          datasets: [
            {
              data: [verified, unverified ,pending, shortlisted],
              backgroundColor: ["#18A07A", "#d84848", "#f29d41", '#0074EE'],
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
                padding: 20, // Padding between the legend and chart
              },
            },
          },
          maintainAspectRatio: false, // Maintain aspect ratio to fill the container
        }}
      />
    </div>
  );
};

export default PieChart;
