document.addEventListener("DOMContentLoaded", () => {
  const salesCtx = document.getElementById("salesChart").getContext("2d");
  const salesChart = new Chart(salesCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Sales (shs)",
          data: [],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  const categoryCtx = document.getElementById("categoryChart").getContext("2d");
  const categoryChart = new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
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

  // Helper function to show error message
  function showError(elementId, message = "Error") {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.color = "#e74c3c";
    }
  }

  // Helper function to show loading state
  function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = "Loading...";
      element.style.color = "#95a5a6";
    }
  }

  async function fetchDashboardData() {
    try {
      // Show loading states
      showLoading("salesAmount");
      showLoading("stockValue");
      showLoading("lowStockItems");

      // Fetch main dashboard data
      const res = await fetch("/api/dashboard");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Check if data is valid
      if (data.error) {
        throw new Error(data.error);
      }

      // Update cards with proper formatting
      const salesElement = document.getElementById("salesAmount");
      if (salesElement) {
        salesElement.textContent = `shs.${(
          data.salesAmount || 0
        ).toLocaleString()}`;
        salesElement.style.color = "#565819"; // Reset to normal color
      }

      const stockElement = document.getElementById("stockValue");
      if (stockElement) {
        stockElement.textContent = `shs.${(
          data.stockValue || 0
        ).toLocaleString()}`;
        stockElement.style.color = "#565819";
      }

      const lowStockElement = document.getElementById("lowStockItems");
      if (lowStockElement) {
        lowStockElement.textContent = data.lowStockItems ?? 0;
        lowStockElement.style.color = "#565819";
      }

      // Fetch Weekly Sales Chart
      try {
        const weeklyRes = await fetch("/api/dashboard/weekly-sales");

        if (!weeklyRes.ok) {
          throw new Error("Failed to fetch weekly sales");
        }

        const weeklyData = await weeklyRes.json();

        if (weeklyData.error) {
          throw new Error(weeklyData.error);
        }

        if (weeklyData.labels && weeklyData.data) {
          salesChart.data.labels = weeklyData.labels;
          salesChart.data.datasets[0].data = weeklyData.data;
          salesChart.update();
        }
      } catch (chartErr) {
        console.error("Weekly sales chart error:", chartErr);
        // Show error message on chart
        salesChart.data.labels = ["Error"];
        salesChart.data.datasets[0].data = [0];
        salesChart.update();
      }

      // Fetch Stock Category Chart
      try {
        const catRes = await fetch("/api/dashboard/stock-categories");

        if (!catRes.ok) {
          throw new Error("Failed to fetch stock categories");
        }

        const catData = await catRes.json();

        if (catData.error) {
          throw new Error(catData.error);
        }

        if (catData.labels && catData.data) {
          const lowStockThreshold = 5;
          const colors = catData.data.map((count) =>
            count <= lowStockThreshold ? "#e74c3c" : "#3498db"
          );
          categoryChart.data.labels = catData.labels;
          categoryChart.data.datasets[0].data = catData.data;
          categoryChart.data.datasets[0].backgroundColor = colors;
          categoryChart.update();
        }
      } catch (chartErr) {
        console.error("Stock category chart error:", chartErr);
        // Show error message on chart
        categoryChart.data.labels = ["Error"];
        categoryChart.data.datasets[0].data = [1];
        categoryChart.data.datasets[0].backgroundColor = ["#e74c3c"];
        categoryChart.update();
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);

      // Display error messages to user
      showError("salesAmount", "Error");
      showError("stockValue", "Error");
      showError("lowStockItems", "Error");

      // Optionally show a notification to the user
      showNotification(
        "Failed to load dashboard data. Please refresh the page.",
        "error"
      );
    }
  }

  // Optional: Toast notification function
  function showNotification(message, type = "info") {
    // Check if notification container exists, if not create it
    let container = document.getElementById("notification-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      `;
      document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.style.cssText = `
      background: ${type === "error" ? "#e74c3c" : "#3498db"};
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Add CSS animations for notifications
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Initial fetch
  fetchDashboardData();

  // Refresh every 30 seconds
  setInterval(fetchDashboardData, 30000);

  // Optional: Add manual refresh button functionality
  const refreshBtn = document.getElementById("refreshDashboard");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      showNotification("Refreshing dashboard...", "info");
      fetchDashboardData();
    });
  }
});
