document.addEventListener("DOMContentLoaded", function () {
  // Initialize charts
  initCharts();

  // Generate report button functionality
  document
    .getElementById("generateReport")
    .addEventListener("click", function () {
      const btn = this;
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        // Show success message
        alert("Report generated successfully!");
      }, 1500);
    });

  // Initialize charts
  function initCharts() {
    // Category Chart
    const categoryCtx = document
      .getElementById("categoryChart")
      .getContext("2d");
    new Chart(categoryCtx, {
      type: "doughnut",
      data: {
        labels: ["Timber", "Poles", "Hardwood", "Furniture", "Softwood"],
        datasets: [
          {
            data: [30, 15, 25, 20, 10],
            backgroundColor: [
              "#2c3e50",
              "#3498db",
              "#e67e22",
              "#27ae60",
              "#9b59b6",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    // Sales Chart
    const salesCtx = document.getElementById("salesChart").getContext("2d");
    new Chart(salesCtx, {
      type: "line",
      data: {
        labels: [
          "Oct 1",
          "Oct 5",
          "Oct 10",
          "Oct 15",
          "Oct 20",
          "Oct 25",
          "Oct 30",
        ],
        datasets: [
          {
            label: "Daily Revenue",
            data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
