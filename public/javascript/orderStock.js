// document.addEventListener("DOMContentLoaded", function () {
//   // Set today's date as default for order date
//   const today = new Date();
//   const expectedDate = new Date();
//   expectedDate.setDate(today.getDate() + 7);

//   document.getElementById("orderDate").value = today
//     .toISOString()
//     .split("T")[0];
//   document.getElementById("expectedDate").value = expectedDate
//     .toISOString()
//     .split("T")[0];

//   // Supplier data
//   const suppliers = {
//     1: {
//       contact: "Robert Johnson",
//       phone: "+1 (555) 123-4567",
//       email: "robert@timberlandsuppliers.com",
//       address: "123 Timber Ave, Forestville, WA 98001",
//     },
//     2: {
//       contact: "Sarah Williams",
//       phone: "+1 (555) 234-5678",
//       email: "sarah@premiumwoods.com",
//       address: "456 Oak Street, Woodland, CA 95695",
//     },
//     3: {
//       contact: "Michael Brown",
//       phone: "+1 (555) 345-6789",
//       email: "michael@forestproducts.com",
//       address: "789 Pine Road, Lumberton, OR 97034",
//     },
//     4: {
//       contact: "Jennifer Davis",
//       phone: "+1 (555) 456-7890",
//       email: "jennifer@hardwoodimporters.com",
//       address: "321 Cedar Lane, Maplewood, MN 55109",
//     },
//     5: {
//       contact: "David Wilson",
//       phone: "+1 (555) 567-8901",
//       email: "david@furniturecomponents.com",
//       address: "654 Elm Drive, Furnishville, NC 27510",
//     },
//   };

//   // Show supplier details when a supplier is selected
//   document.getElementById("supplier").addEventListener("change", function () {
//     const supplierId = this.value;
//     const detailsDiv = document.getElementById("supplierDetails");

//     if (supplierId && suppliers[supplierId]) {
//       const supplier = suppliers[supplierId];
//       document.getElementById("supplierContact").textContent = supplier.contact;
//       document.getElementById("supplierPhone").textContent = supplier.phone;
//       document.getElementById("supplierEmail").textContent = supplier.email;
//       document.getElementById("supplierAddress").textContent = supplier.address;
//       detailsDiv.style.display = "block";
//     } else {
//       detailsDiv.style.display = "none";
//     }
//   });

//   // Add new item row
//   document.getElementById("addItemBtn").addEventListener("click", function () {
//     const tbody = document.getElementById("itemsTableBody");
//     const newRow = document.createElement("tr");

//     newRow.innerHTML = `
//                     <td>
//                         <select class="product-select" name="product[]" required>
//                             <option value="">Select Product</option>
//                             <option value="1">Mahogany Timber Plank</option>
//                             <option value="2">Oak Wood Beam</option>
//                             <option value="3">Teak Hardwood</option>
//                             <option value="4">Pine Wood</option>
//                             <option value="5">Plywood Sheet</option>
//                         </select>
//                     </td>
//                     <td><input type="number" name="quantity[]" min="1" value="1" required></td>
//                     <td><input type="number" name="cost[]" step="0.01" min="0" value="0.00" required></td>
//                     <td>$0.00</td>
//                     <td class="item-actions">
//                         <button type="button" class="btn-remove"><i class="fas fa-trash"></i></button>
//                     </td>
//                 `;

//     tbody.appendChild(newRow);

//     // Add event listeners to new inputs
//     const quantityInput = newRow.querySelector('input[name="quantity[]"]');
//     const costInput = newRow.querySelector('input[name="cost[]"]');

//     quantityInput.addEventListener("input", calculateRowTotal);
//     costInput.addEventListener("input", calculateRowTotal);

//     // Add event listener to remove button
//     newRow.querySelector(".btn-remove").addEventListener("click", function () {
//       tbody.removeChild(newRow);
//       calculateTotal();
//     });
//   });

//   // Remove item row
//   document.querySelectorAll(".btn-remove").forEach((button) => {
//     button.addEventListener("click", function () {
//       const row = this.closest("tr");
//       row.parentNode.removeChild(row);
//       calculateTotal();
//     });
//   });

//   // Calculate row total when quantity or cost changes
//   function calculateRowTotal() {
//     const row = this.closest("tr");
//     const quantity =
//       parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
//     const cost =
//       parseFloat(row.querySelector('input[name="cost[]"]').value) || 0;
//     const total = quantity * cost;

//     row.querySelector("td:nth-child(4)").textContent = "$" + total.toFixed(2);
//     calculateTotal();
//   }

//   // Calculate order total
//   function calculateTotal() {
//     let subtotal = 0;

//     document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
//       const totalCell = row.querySelector("td:nth-child(4)").textContent;
//       const value = parseFloat(totalCell.replace("$", "")) || 0;
//       subtotal += value;
//     });

//     const shippingCost =
//       parseFloat(document.getElementById("shippingCost").value) || 0;
//     const total = subtotal + shippingCost;

//     document.querySelector(
//       ".summary-row:nth-child(1) span:nth-child(2)"
//     ).textContent = "$" + subtotal.toFixed(2);
//     document.getElementById("shippingDisplay").textContent =
//       "$" + shippingCost.toFixed(2);
//     document.getElementById("orderTotal").textContent = "$" + total.toFixed(2);
//   }

//   // Add event listeners to existing quantity and cost inputs
//   document
//     .querySelectorAll('input[name="quantity[]"], input[name="cost[]"]')
//     .forEach((input) => {
//       input.addEventListener("input", calculateRowTotal);
//     });

//   // Update total when shipping cost changes
//   document
//     .getElementById("shippingCost")
//     .addEventListener("input", calculateTotal);

//   // Form submission
//   document.getElementById("orderForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     // Basic validation
//     const supplier = document.getElementById("supplier").value;
//     const orderDate = document.getElementById("orderDate").value;
//     const paymentTerms = document.getElementById("paymentTerms").value;

//     if (!supplier || !orderDate || !paymentTerms) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     // Check if at least one item is added
//     const items = document.querySelectorAll("#itemsTableBody tr");
//     if (items.length === 0) {
//       alert("Please add at least one item to the order");
//       return;
//     }

//     // Check if all items have valid costs
//     let validItems = true;
//     document.querySelectorAll('input[name="cost[]"]').forEach((input) => {
//       if (parseFloat(input.value) <= 0) {
//         validItems = false;
//       }
//     });

//     if (!validItems) {
//       alert("Please enter a valid cost for all items");
//       return;
//     }

//     // In a real application, you would send the form data to the server here
//     alert("Purchase order created successfully!");
//     // this.reset();
//   });

//   // Initialize calculations
//   calculateTotal();
// });


document.addEventListener("DOMContentLoaded", function () {
  // ------------------------------
  // 1. Set default dates
  // ------------------------------
  const today = new Date();
  const expectedDate = new Date();
  expectedDate.setDate(today.getDate() + 7);

  document.getElementById("orderDate").value = today
    .toISOString()
    .split("T")[0];
  document.getElementById("expectedDate").value = expectedDate
    .toISOString()
    .split("T")[0];

  // ------------------------------
  // 2. Supplier data
  // ------------------------------
  const suppliers = {
    1: {
      contact: "Kawooya Clement",
      phone: "0752346792",
      email: "clementsuppliers@gmail.com",
      address: "Masajja",
    },
    2: {
      contact: "Kinalwa Warren",
      phone: "0763421900",
      email: "premiumwoods.com",
      address: "Lubowa",
    },
    3: {
      contact: "Amon Micheal",
      phone: "0700550011",
      email: "michael@forestproducts.com",
      address: "Kitoro",
    },
    4: {
      contact: "Kirumira Dennis",
      phone: "0793123456",
      email: "denoimporters@gmail.com",
      address: "Ggaba",
    },
    5: {
      contact: "Tendo Baptist",
      phone: "0782976100",
      email: "tendofurniture@gmail.com",
      address: "Kakiri",
    },
  };

  // ------------------------------
  // 3. Supplier details toggle
  // ------------------------------
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

  // ------------------------------
  // 4. Add and remove item rows
  // ------------------------------
  document.getElementById("addItemBtn").addEventListener("click", function () {
    const tbody = document.getElementById("itemsTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>
        <select class="product-select" name="product[]" required>
          <option value="">Select Product</option>
          <option value="1">Storage cabins</option>
          <option value="2">Ebony Planks</option>
          <option value="3">Pine Logs</option>
          <option value="4">Plywood</option>
          <option value="5">Cedar Beams</option>
          <option value="6">Poles</option>
          <option value="7">Dining tables</option>
          <option value="8">Cupboards</option>
          <option value="9">Beds</option>
          <option value="10">Book shelves</option>
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

    // Add listeners for calculations + live validation
    newRow.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", calculateRowTotal);
      el.addEventListener("input", () => clearFieldError(el));
      el.addEventListener("change", () => clearFieldError(el));
    });

    // Remove button
    newRow.querySelector(".btn-remove").addEventListener("click", function () {
      tbody.removeChild(newRow);
      calculateTotal();
    });
  });

  // ------------------------------
  // 5. Calculation logic
  // ------------------------------
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

  function calculateTotal() {
    let subtotal = 0;
    document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
      const totalCell = row.querySelector("td:nth-child(4)").textContent;
      const value = parseFloat(totalCell.replace("$", "")) || 0;
      subtotal += value;
    });

    const shippingCost =
      parseFloat(document.getElementById("deliveryCost").value) || 0;
    const total = subtotal + shippingCost;

    document.querySelector(
      ".summary-row:nth-child(1) span:nth-child(2)"
    ).textContent = "$" + subtotal.toFixed(2);
    document.getElementById("deliveryDisplay").textContent =
      "$" + shippingCost.toFixed(2);
    document.getElementById("orderTotal").textContent = "$" + total.toFixed(2);
  }

  document
    .querySelectorAll('input[name="quantity[]"], input[name="cost[]"]')
    .forEach((input) => {
      input.addEventListener("input", calculateRowTotal);
      input.addEventListener("input", () => clearFieldError(input));
    });

  document
    .getElementById("deliveryCost")
    .addEventListener("input", calculateTotal);

  // ------------------------------
  // 6. Enhanced form validation (Live)
  // ------------------------------
  const form = document.getElementById("orderForm");
  form.setAttribute("novalidate", true);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate required fields
    form.querySelectorAll("[required]").forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        showError(field, "This field is required.");
        isValid = false;
      }
    });

    // Ensure at least one item
    const items = document.querySelectorAll("#itemsTableBody tr");
    if (items.length === 0) {
      showFormError("Please add at least one product to your order.");
      isValid = false;
    }

    // Validate costs > 0
    document.querySelectorAll('input[name="cost[]"]').forEach((input) => {
      if (parseFloat(input.value) <= 0) {
        showError(input, "Cost must be greater than 0.");
        isValid = false;
      }
    });

    if (isValid) {
      alert(" Purchase order created successfully!");
      // form.submit(); // enable if needed
    }
  });

  // ------------------------------
  // 7. Utility functions
  // ------------------------------
  function showError(field, message) {
    if (field.parentElement.querySelector(".error-message")) return;
    field.style.border = "1px solid red";
    const error = document.createElement("small");
    error.className = "error-message";
    error.style.color = "red";
    error.style.display = "block";
    error.style.marginTop = "3px";
    error.textContent = message;
    field.parentElement.appendChild(error);
  }

  function clearFieldError(field) {
    const error = field.parentElement.querySelector(".error-message");
    if (error) error.remove();
    field.style.border = "1px solid #ccc";
  }

  function showFormError(message) {
    const formHeader = document.querySelector(".form-header");
    const error = document.createElement("div");
    error.className = "form-error";
    error.style.color = "red";
    error.style.marginBottom = "10px";
    error.textContent = message;
    formHeader.insertAdjacentElement("afterend", error);
  }

  function clearErrors() {
    document
      .querySelectorAll(".error-message, .form-error")
      .forEach((el) => el.remove());
    form
      .querySelectorAll("input, select")
      .forEach((f) => (f.style.border = "1px solid #ccc"));
  }

  // Attach live validation for existing inputs
  form.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
    field.addEventListener("change", () => clearFieldError(field));
  });

  // Initialize totals
  calculateTotal();
});




