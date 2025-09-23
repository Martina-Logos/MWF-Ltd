// Sales Chart
const salesCtx = document.getElementById("salesChart").getContext("2d");
const salesChart = new Chart(salesCtx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Sales ($)",
        data: [2850, 3200, 2750, 3458, 3100, 1850],
        backgroundColor: "#3498db",
        borderColor: "#2980b9",
        borderWidth: 1,
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
    scales: {
      y: {
        beginAtZero: true,
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

// Simulate product search
document
  .querySelector(".search-box button")
  .addEventListener("click", function () {
    const searchTerm = document.querySelector(".search-box input").value;
    if (searchTerm) {
      alert(`Searching for: ${searchTerm}`);
    } else {
      alert("Please enter a search term");
    }
  });

// Quick action buttons
document.querySelectorAll(".action-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const action = this.querySelector("span").textContent;
    alert(`Initiating: ${action}`);
  });
});
