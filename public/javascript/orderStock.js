document.addEventListener("DOMContentLoaded", function () {
  // Set today's date as default for order date
  const today = new Date();
  const expectedDate = new Date();
  expectedDate.setDate(today.getDate() + 7);

  document.getElementById("orderDate").value = today
    .toISOString()
    .split("T")[0];
  document.getElementById("expectedDate").value = expectedDate
    .toISOString()
    .split("T")[0];

  // Supplier data
  const suppliers = {
    1: {
      contact: "Robert Johnson",
      phone: "+1 (555) 123-4567",
      email: "robert@timberlandsuppliers.com",
      address: "123 Timber Ave, Forestville, WA 98001",
    },
    2: {
      contact: "Sarah Williams",
      phone: "+1 (555) 234-5678",
      email: "sarah@premiumwoods.com",
      address: "456 Oak Street, Woodland, CA 95695",
    },
    3: {
      contact: "Michael Brown",
      phone: "+1 (555) 345-6789",
      email: "michael@forestproducts.com",
      address: "789 Pine Road, Lumberton, OR 97034",
    },
    4: {
      contact: "Jennifer Davis",
      phone: "+1 (555) 456-7890",
      email: "jennifer@hardwoodimporters.com",
      address: "321 Cedar Lane, Maplewood, MN 55109",
    },
    5: {
      contact: "David Wilson",
      phone: "+1 (555) 567-8901",
      email: "david@furniturecomponents.com",
      address: "654 Elm Drive, Furnishville, NC 27510",
    },
  };

  // Show supplier details when a supplier is selected
  document.getElementById("supplier").addEventListener("change", function () {
    const supplierId = this.value;
    const detailsDiv = document.getElementById("supplierDetails");

    if (supplierId && suppliers[supplierId]) {
      const supplier = suppliers[supplierId];
      document.getElementById("supplierContact").textContent = supplier.contact;
      document.getElementById("supplierPhone").textContent = supplier.phone;
      document.getElementById("supplierEmail").textContent = supplier.email;
      document.getElementById("supplierAddress").textContent = supplier.address;
      detailsDiv.style.display = "block";
    } else {
      detailsDiv.style.display = "none";
    }
  });

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
                            <option value="4">Pine Wood</option>
                            <option value="5">Plywood Sheet</option>
                        </select>
                    </td>
                    <td><input type="number" name="quantity[]" min="1" value="1" required></td>
                    <td><input type="number" name="cost[]" step="0.01" min="0" value="0.00" required></td>
                    <td>$0.00</td>
                    <td class="item-actions">
                        <button type="button" class="btn-remove"><i class="fas fa-trash"></i></button>
                    </td>
                `;

    tbody.appendChild(newRow);

    // Add event listeners to new inputs
    const quantityInput = newRow.querySelector('input[name="quantity[]"]');
    const costInput = newRow.querySelector('input[name="cost[]"]');

    quantityInput.addEventListener("input", calculateRowTotal);
    costInput.addEventListener("input", calculateRowTotal);

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

  // Calculate row total when quantity or cost changes
  function calculateRowTotal() {
    const row = this.closest("tr");
    const quantity =
      parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
    const cost =
      parseFloat(row.querySelector('input[name="cost[]"]').value) || 0;
    const total = quantity * cost;

    row.querySelector("td:nth-child(4)").textContent = "$" + total.toFixed(2);
    calculateTotal();
  }

  // Calculate order total
  function calculateTotal() {
    let subtotal = 0;

    document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
      const totalCell = row.querySelector("td:nth-child(4)").textContent;
      const value = parseFloat(totalCell.replace("$", "")) || 0;
      subtotal += value;
    });

    const shippingCost =
      parseFloat(document.getElementById("shippingCost").value) || 0;
    const total = subtotal + shippingCost;

    document.querySelector(
      ".summary-row:nth-child(1) span:nth-child(2)"
    ).textContent = "$" + subtotal.toFixed(2);
    document.getElementById("shippingDisplay").textContent =
      "$" + shippingCost.toFixed(2);
    document.getElementById("orderTotal").textContent = "$" + total.toFixed(2);
  }

  // Add event listeners to existing quantity and cost inputs
  document
    .querySelectorAll('input[name="quantity[]"], input[name="cost[]"]')
    .forEach((input) => {
      input.addEventListener("input", calculateRowTotal);
    });

  // Update total when shipping cost changes
  document
    .getElementById("shippingCost")
    .addEventListener("input", calculateTotal);

  // Form submission
  document.getElementById("orderForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const supplier = document.getElementById("supplier").value;
    const orderDate = document.getElementById("orderDate").value;
    const paymentTerms = document.getElementById("paymentTerms").value;

    if (!supplier || !orderDate || !paymentTerms) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if at least one item is added
    const items = document.querySelectorAll("#itemsTableBody tr");
    if (items.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    // Check if all items have valid costs
    let validItems = true;
    document.querySelectorAll('input[name="cost[]"]').forEach((input) => {
      if (parseFloat(input.value) <= 0) {
        validItems = false;
      }
    });

    if (!validItems) {
      alert("Please enter a valid cost for all items");
      return;
    }

    // In a real application, you would send the form data to the server here
    alert("Purchase order created successfully!");
    // this.reset();
  });

  // Initialize calculations
  calculateTotal();
});
