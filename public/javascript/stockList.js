// Sample stock data
const stockData = [
  {
    id: "PRD-001",
    name: "Mahogany Timber Plank",
    type: "Timber",
    supplier: "Timberland Suppliers",
    costPrice: 85.0,
    sellingPrice: 125.0,
    stockLevel: 42,
    minStock: 20,
    quality: "premium",
    lastUpdated: "2023-11-15",
    color: "Dark Brown",
    measurements: "2x4x8 ft",
  },
  {
    id: "PRD-002",
    name: "Oak Wood Beam",
    type: "Hardwood",
    supplier: "Premium Woods Ltd",
    costPrice: 65.5,
    sellingPrice: 95.0,
    stockLevel: 28,
    minStock: 15,
    quality: "premium",
    lastUpdated: "2023-11-14",
    color: "Light Brown",
    measurements: "4x4x10 ft",
  },
  {
    id: "PRD-003",
    name: "Teak Hardwood Planks",
    type: "Hardwood",
    supplier: "Forest Products Co.",
    costPrice: 75.0,
    sellingPrice: 110.0,
    stockLevel: 15,
    minStock: 10,
    quality: "premium",
    lastUpdated: "2023-11-13",
    color: "Golden Brown",
    measurements: "1x6x8 ft",
  },
  {
    id: "PRD-004",
    name: "Pine Wood Sheets",
    type: "Softwood",
    supplier: "Timberland Suppliers",
    costPrice: 25.0,
    sellingPrice: 35.0,
    stockLevel: 120,
    minStock: 50,
    quality: "standard",
    lastUpdated: "2023-11-15",
    color: "Light Yellow",
    measurements: "4x8 ft",
  },
  {
    id: "PRD-005",
    name: "Office Desk",
    type: "Furniture",
    supplier: "Furniture Components Inc.",
    costPrice: 180.0,
    sellingPrice: 280.0,
    stockLevel: 8,
    minStock: 5,
    quality: "premium",
    lastUpdated: "2023-11-12",
    color: "Mahogany",
    measurements: "60x30x30 in",
  },
  {
    id: "PRD-006",
    name: "Dining Table",
    type: "Furniture",
    supplier: "Furniture Components Inc.",
    costPrice: 220.0,
    sellingPrice: 350.0,
    stockLevel: 5,
    minStock: 3,
    quality: "premium",
    lastUpdated: "2023-11-10",
    color: "Oak Finish",
    measurements: "72x36x30 in",
  },
  {
    id: "PRD-007",
    name: "Plywood Sheet",
    type: "Timber",
    supplier: "Hardwood Importers",
    costPrice: 35.0,
    sellingPrice: 50.0,
    stockLevel: 65,
    minStock: 30,
    quality: "standard",
    lastUpdated: "2023-11-14",
    color: "Brown",
    measurements: "4x8 ft",
  },
  {
    id: "PRD-008",
    name: "Cedar Poles",
    type: "Poles",
    supplier: "Forest Products Co.",
    costPrice: 45.0,
    sellingPrice: 65.0,
    stockLevel: 3,
    minStock: 10,
    quality: "standard",
    lastUpdated: "2023-11-11",
    color: "Reddish Brown",
    measurements: "6x6x8 ft",
  },
  {
    id: "PRD-009",
    name: "Bookshelf",
    type: "Furniture",
    supplier: "Furniture Components Inc.",
    costPrice: 90.0,
    sellingPrice: 150.0,
    stockLevel: 12,
    minStock: 5,
    quality: "economy",
    lastUpdated: "2023-11-13",
    color: "White",
    measurements: "36x12x72 in",
  },
  {
    id: "PRD-010",
    name: "Maple Hardwood",
    type: "Hardwood",
    supplier: "Premium Woods Ltd",
    costPrice: 70.0,
    sellingPrice: 105.0,
    stockLevel: 22,
    minStock: 15,
    quality: "premium",
    lastUpdated: "2023-11-15",
    color: "Light Brown",
    measurements: "2x4x8 ft",
  },
];

// Function to determine stock status
function getStockStatus(stockLevel, minStock) {
  if (stockLevel === 0) {
    return "out-of-stock";
  } else if (stockLevel <= minStock) {
    return "low-stock";
  } else {
    return "in-stock";
  }
}

// Function to render stock table
function renderStockTable(data) {
  const tbody = document.getElementById("stockTableBody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const status = getStockStatus(item.stockLevel, item.minStock);
    const statusText =
      status === "in-stock"
        ? "In Stock"
        : status === "low-stock"
        ? "Low Stock"
        : "Out of Stock";

    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.supplier}</td>
                    <td>$${item.costPrice.toFixed(2)}</td>
                    <td>$${item.sellingPrice.toFixed(2)}</td>
                    <td>${item.stockLevel} units</td>
                    <td><span class="status ${status}">${statusText}</span></td>
                    <td><span class="quality ${item.quality}">${
      item.quality.charAt(0).toUpperCase() + item.quality.slice(1)
    }</span></td>
                    <td>${item.lastUpdated}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn btn-view" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" title="Edit Product">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" title="Delete Product">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;

    tbody.appendChild(row);
  });
}

// Function to filter stock data
function filterStockData() {
  const searchTerm = document
    .querySelector(".search-box input")
    .value.toLowerCase();
  const typeFilter = document.getElementById("categoryFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;
  const qualityFilter = document.getElementById("qualityFilter").value;

  const filteredData = stockData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm) ||
      item.supplier.toLowerCase().includes(searchTerm);

    const matchesType = !typeFilter || item.type.toLowerCase() === typeFilter;

    const matchesStatus =
      !statusFilter ||
      getStockStatus(item.stockLevel, item.minStock) === statusFilter;

    const matchesQuality = !qualityFilter || item.quality === qualityFilter;

    return matchesSearch && matchesType && matchesStatus && matchesQuality;
  });

  renderStockTable(filteredData);
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Render initial stock table
  renderStockTable(stockData);

  // Add event listeners for filters
  document
    .querySelector(".search-box button")
    .addEventListener("click", filterStockData);
  document
    .querySelector(".search-box input")
    .addEventListener("input", filterStockData);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterStockData);
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterStockData);
  document
    .getElementById("qualityFilter")
    .addEventListener("change", filterStockData);

  // Add event listeners for action buttons
  document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-view")) {
      const row = e.target.closest("tr");
      const productId = row.cells[0].textContent;
      alert(`View details for product: ${productId}`);
    }

    if (e.target.closest(".btn-edit")) {
      const row = e.target.closest("tr");
      const productId = row.cells[0].textContent;
      alert(`Edit product: ${productId}`);
    }

    if (e.target.closest(".btn-delete")) {
      const row = e.target.closest("tr");
      const productId = row.cells[0].textContent;
      if (confirm(`Are you sure you want to delete product ${productId}?`)) {
        alert(`Product ${productId} deleted successfully!`);
      }
    }
  });

  // Add new product button
  document.querySelector(".btn-primary").addEventListener("click", function () {
    alert("Redirecting to add product form...");
  });

  // Export button
  document.querySelector(".btn-success").addEventListener("click", function () {
    alert("Exporting stock data to CSV...");
  });
});
