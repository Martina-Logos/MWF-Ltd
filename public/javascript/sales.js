// document.addEventListener("DOMContentLoaded", function () {
//   // Set today's date as default for sale date
//   const saleDateInput = document.getElementById("saleDate");
//   const today = new Date();
//   saleDateInput.value = today.toISOString().split("T")[0];

//   // Add new item row
//   const addItemBtn = document.getElementById("addItemBtn");
//   addItemBtn.addEventListener("click", function () {
//     const tbody = document.getElementById("itemsTableBody");
//     const newRow = document.createElement("tr");

//     newRow.innerHTML = `
//       <td>
//         <select class="product-select" name="product[]" required>
//           <option value="">Select Product</option>
//           <option value="Mahogany Timber Plank">Mahogany Timber Plank</option>
//           <option value="Oak Wood Beam">Oak Wood Beam</option>
//           <option value="Teak Hardwood">Teak Hardwood</option>
//           <option value="Office Desk">Office Desk</option>
//           <option value="Dining Table">Dining Table</option>
//         </select>
//       </td>
//       <td><input type="number" name="quantity[]" min="1" value="1" required></td>
//       <td><input type="number" name="price[]" step="0.01" min="0" value="0.00" required></td>
//       <td>shs0.00</td>
//       <td class="item-actions">
//         <button type="button" class="btn-remove"><i class="fas fa-trash"></i></button>
//       </td>
//     `;
//     tbody.appendChild(newRow);

//     // Add event listeners for the new row
//     const quantityInput = newRow.querySelector('input[name="quantity[]"]');
//     const priceInput = newRow.querySelector('input[name="price[]"]');
//     quantityInput.addEventListener("input", calculateRowTotal);
//     priceInput.addEventListener("input", calculateRowTotal);

//     newRow.querySelector(".btn-remove").addEventListener("click", function () {
//       tbody.removeChild(newRow);
//       calculateTotal();
//     });
//   });

//   // Remove existing item rows
//   document.querySelectorAll(".btn-remove").forEach((button) => {
//     button.addEventListener("click", function () {
//       const row = this.closest("tr");
//       row.parentNode.removeChild(row);
//       calculateTotal();
//     });
//   });

//   // Calculate row total
//   function calculateRowTotal() {
//     const row = this.closest("tr");
//     const quantity =
//       parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
//     const price =
//       parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
//     const total = quantity * price;
//     row.querySelector("td:nth-child(4)").textContent = `shs${total.toFixed(2)}`;
//     calculateTotal();
//   }

//   // Calculate subtotal, transport fee, total
//   function calculateTotal() {
//     let subtotal = 0;
//     document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
//       const value =
//         parseFloat(
//           row.querySelector("td:nth-child(4)").textContent.replace("shs", "")
//         ) || 0;
//       subtotal += value;
//     });

//     const provideTransport =
//       document.getElementById("provideTransport").checked;
//     const transportFee = provideTransport ? subtotal * 0.05 : 0;
//     const total = subtotal + transportFee;

//     document.querySelector(
//       ".summary-row:nth-child(1) span:nth-child(2)"
//     ).textContent = `shs${subtotal.toFixed(2)}`;

//     const transportRow = document.getElementById("transportRow");
//     if (provideTransport) {
//       transportRow.style.display = "flex";
//       transportRow.querySelector(
//         "span:nth-child(2)"
//       ).textContent = `shs${transportFee.toFixed(2)}`;
//     } else {
//       transportRow.style.display = "none";
//     }

//     document.getElementById("totalAmount").textContent = `shs${total.toFixed(
//       2
//     )}`;
//   }

//   // Update totals when quantity/price changes
//   document
//     .querySelectorAll('input[name="quantity[]"], input[name="price[]"]')
//     .forEach((input) => {
//       input.addEventListener("input", calculateRowTotal);
//     });

//   // Toggle transport fee
//   document
//     .getElementById("provideTransport")
//     .addEventListener("change", calculateTotal);

//   // Customer search simulation
//   document
//     .querySelector(".customer-search button")
//     .addEventListener("click", function () {
//       const searchTerm = document.querySelector(".customer-search input").value;
//       if (!searchTerm) return alert("Please enter a search term");

//       // Fake search result
//       document.getElementById("customerName").value = "BuildIT Constructions";
//       document.getElementById("customerContact").value = "Robert Johnson";
//       document.getElementById("customerAddress").value =
//         "123 Construction Ave, Buildington";
//       document.getElementById("customerPhone").value = "+1 (555) 123-4567";
//       alert(`Customer "${searchTerm}" loaded`);
//     });

//   // Initialize totals on page load
//   calculateTotal();
// });

// document.querySelector(".btn-primary").addEventListener("click", function () {
//   // Get form data
//   const customerName = document.getElementById("customerName").value;
//   const saleDate = document.getElementById("saleDate").value;
//   const items = document.querySelectorAll("#itemsTableBody tr");

//   // Fill receipt fields
//   document.getElementById("receiptCustomer").textContent = customerName;
//   document.getElementById("receiptDate").textContent = saleDate;
//   document.getElementById("receiptNumber").textContent = Date.now(); // or from backend

//   let subtotal = 0;
//   let tbody = document.getElementById("receiptItems");
//   tbody.innerHTML = "";

//   items.forEach((row) => {
//     const product = row.querySelector("select").selectedOptions[0].text;
//     const qty = row.querySelector('input[name="quantity[]"]').value;
//     const price = row.querySelector('input[name="price[]"]').value;
//     const total = qty * price;

//     subtotal += total;

//     tbody.innerHTML += `
//       <tr>
//         <td>${product}</td>
//         <td>${qty}</td>
//         <td>shs${price}</td>
//         <td>shs${total}</td>
//       </tr>`;
//   });

//   const transport = document.getElementById("provideTransport").checked
//     ? subtotal * 0.05
//     : 0;
//   const total = subtotal + transport;

//   document.getElementById(
//     "receiptSubtotal"
//   ).textContent = `shs${subtotal.toFixed(2)}`;
//   document.getElementById(
//     "receiptTransport"
//   ).textContent = `shs${transport.toFixed(2)}`;
//   document.getElementById("receiptTotal").textContent = `shs${total.toFixed(
//     2
//   )}`;

//   // Show receipt
//   document.getElementById("receiptPreview").classList.remove("hidden");
// });


script.document.addEventListener("DOMContentLoaded", function () {
  // Calculate row total
  function calculateRowTotal(row) {
    const qty =
      parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
    const price =
      parseFloat(row.querySelector('input[name="price[]"]').value) || 0;
    const total = qty * price;
    row.querySelector("td:nth-child(4)").textContent = `shs${total.toFixed(2)}`;
    return total;
  }

  // Calculate subtotal, transport fee, total
  function calculateTotals() {
    let subtotal = 0;
    document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
      subtotal += calculateRowTotal(row);
    });

    const transportChecked =
      document.getElementById("provideTransport").checked;
    const transportFee = transportChecked ? subtotal * 0.05 : 0;
    const total = subtotal + transportFee;

    document.querySelector(
      ".summary-row:nth-child(1) span:nth-child(2)"
    ).textContent = `shs${subtotal.toFixed(2)}`;

    const transportRow = document.getElementById("transportRow");
    if (transportChecked) {
      transportRow.style.display = "flex";
      transportRow.querySelector(
        "span:nth-child(2)"
      ).textContent = `shs${transportFee.toFixed(2)}`;
    } else {
      transportRow.style.display = "none";
    }

    document.getElementById("totalAmount").textContent = `shs${total.toFixed(
      2
    )}`;
  }

  // Attach listeners
  document
    .querySelectorAll('input[name="quantity[]"], input[name="price[]"]')
    .forEach((input) => {
      input.addEventListener("input", calculateTotals);
    });

  const transportCheckbox = document.getElementById("provideTransport");
  if (transportCheckbox)
    transportCheckbox.addEventListener("change", calculateTotals);

  // Initial calculation
  calculateTotals();
});

