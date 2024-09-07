import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const PieChart = ({approved, pending, shortlisted}) => {
  return (
    <div
      style={{ height: "326px", width: "100%" }}
      className="flex justify-center items-center mt-6"
    >
      <Doughnut
        data={{
          labels: ["Approved", "Pending", "Shortlist"],
          datasets: [
            {
              data: [approved, shortlisted, pending],
              backgroundColor: ["#18A07A", "#F29D41", "#D84848"],
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
                padding: 30, // Padding between the legend and chart
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
