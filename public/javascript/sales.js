document.addEventListener("DOMContentLoaded", function () {
  // Set today's date as default for sale date
  const today = new Date();
  document.getElementById("saleDate").value = today.toISOString().split("T")[0];

  // Add new item row
  document.getElementById("addItemBtn").addEventListener("click", function () {
    const tbody = document.getElementById("itemsTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
                    <td>
                        <select class="product-select" name="product[]" required>
                            <option value="">Select Product</option>
                            <option value="1">Mahogany Timber Plank</option>
                            <option value="2">Oak Wood Beam</option>
                            <option value="3">Teak Hardwood</option>
                            <option value="4">Office Desk</option>
                            <option value="5">Dining Table</option>
                        </select>
                    </td>
                    <td><input type="number" name="quantity[]" min="1" value="1" required></td>
                    <td><input type="number" name="price[]" step="0.01" min="0" value="0.00" required></td>
                    <td>$0.00</td>
                    <td class="item-actions">
                        <button type="button" class="btn-remove"><i class="fas fa-trash"></i></button>
                    </td>
                `;

    tbody.appendChild(newRow);

    // Add event listeners to new inputs
    const quantityInput = newRow.querySelector('input[name="quantity[]"]');
    const priceInput = newRow.querySelector('input[name="price[]"]');

    quantityInput.addEventListener("input", calculateRowTotal);
    priceInput.addEventListener("input", calculateRowTotal);

    // Add event listener to remove button
    newRow.querySelector(".btn-remove").addEventListener("click", function () {
      tbody.removeChild(newRow);
      calculateTotal();
    });
  });

  // Remove item row
  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      row.parentNode.removeChild(row);
      calculateTotal();
    });
  });

  // Calculate row total when quantity or price changes
  function calculateRowTotal() {
    const row = this.closest("tr");
    const quantity =
      parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
    const price =
      parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
    const total = quantity * price;

    row.querySelector("td:nth-child(4)").textContent = "$" + total.toFixed(2);
    calculateTotal();
  }

  // Calculate sale total
  function calculateTotal() {
    let subtotal = 0;

    document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
      const totalCell = row.querySelector("td:nth-child(4)").textContent;
      const value = parseFloat(totalCell.replace("$", "")) || 0;
      subtotal += value;
    });

    const provideTransport =
      document.getElementById("provideTransport").checked;
    const transportFee = provideTransport ? subtotal * 0.05 : 0;
    const total = subtotal + transportFee;

    document.querySelector(
      ".summary-row:nth-child(1) span:nth-child(2)"
    ).textContent = "$" + subtotal.toFixed(2);

    const transportRow = document.getElementById("transportRow");
    if (provideTransport) {
      transportRow.style.display = "flex";
      transportRow.querySelector("span:nth-child(2)").textContent =
        "$" + transportFee.toFixed(2);
    } else {
      transportRow.style.display = "none";
    }

    document.getElementById("totalAmount").textContent = "$" + total.toFixed(2);
  }

  // Add event listeners to existing quantity and price inputs
  document
    .querySelectorAll('input[name="quantity[]"], input[name="price[]"]')
    .forEach((input) => {
      input.addEventListener("input", calculateRowTotal);
    });

  // Toggle transport fee
  document
    .getElementById("provideTransport")
    .addEventListener("change", calculateTotal);

  // Customer search functionality
  document
    .querySelector(".customer-search button")
    .addEventListener("click", function () {
      const searchTerm = document.querySelector(".customer-search input").value;
      if (searchTerm) {
        // Simulate customer search
        alert(`Searching for customer: ${searchTerm}`);
        // In a real application, this would fetch customer data from the server
        document.getElementById("customerName").value = "BuildIT Constructions";
        document.getElementById("customerContact").value = "Robert Johnson";
        document.getElementById("customerAddress").value =
          "123 Construction Ave, Buildington";
        document.getElementById("customerPhone").value = "+1 (555) 123-4567";
      } else {
        alert("Please enter a search term");
      }
    });

  // Form submission
  document.getElementById("salesForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const customerName = document.getElementById("customerName").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!customerName || !paymentMethod) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if at least one item is added
    const items = document.querySelectorAll("#itemsTableBody tr");
    if (items.length === 0) {
      alert("Please add at least one item to the sale");
      return;
    }

    // Check if all items have valid prices
    let validItems = true;
    document.querySelectorAll('input[name="price[]"]').forEach((input) => {
      if (parseFloat(input.value) <= 0) {
        validItems = false;
      }
    });

    if (!validItems) {
      alert("Please enter a valid price for all items");
      return;
    }

    // In a real application, you would send the form data to the server here
    alert("Sale completed successfully! Receipt has been generated.");
    // this.reset();
  });

  // Initialize calculations
  calculateTotal();
});
