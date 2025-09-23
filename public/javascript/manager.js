// Sales Chart
const salesCtx = document.getElementById("salesChart").getContext("2d");
const salesChart = new Chart(salesCtx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [8500, 12500, 9800, 12458, 11000, 7500, 9200],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
    },
  },
});

// Category Chart
const categoryCtx = document.getElementById("categoryChart").getContext("2d");
const categoryChart = new Chart(categoryCtx, {
  type: "doughnut",
  data: {
    labels: ["Timber", "Poles", "Hardwood", "Softwood", "Furniture"],
    datasets: [
      {
        data: [25, 15, 20, 15, 25],
        backgroundColor: [
          "#3498db",
          "#2ecc71",
          "#e67e22",
          "#e74c3c",
          "#9b59b6",
        ],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});
