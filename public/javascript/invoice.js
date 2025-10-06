// Select elements
const invoiceItemsTable = document
  .getElementById("invoiceItemsTable")
  .getElementsByTagName("tbody")[0];
const addItemBtn = document.getElementById("addItemBtn");
const subtotalInput = document.getElementById("subtotal");
const taxInput = document.getElementById("tax");
const discountInput = document.getElementById("discount");
const totalInput = document.getElementById("total");

// Counter for item index
let itemIndex = invoiceItemsTable.rows.length;

// Function to calculate totals
function calculateTotals() {
  let subtotal = 0;

  Array.from(invoiceItemsTable.rows).forEach((row) => {
    const qty =
      parseFloat(row.querySelector("input[name$='[quantity]']").value) || 0;
    const price =
      parseFloat(row.querySelector("input[name$='[price]']").value) || 0;
    const totalCell = row.querySelector("input[name$='[total]']");

    const total = qty * price;
    totalCell.value = total.toFixed(2);
    subtotal += total;
  });

  subtotalInput.value = subtotal.toFixed(2);

  const tax = subtotal * 0.18; // 18% tax
  taxInput.value = tax.toFixed(2);

  const discount = parseFloat(discountInput.value) || 0;

  const grandTotal = subtotal + tax - discount;
  totalInput.value = grandTotal.toFixed(2);
}

// Function to add new row
function addItemRow() {
  const row = invoiceItemsTable.insertRow();
  row.innerHTML = `
    <td><input type="text" name="items[${itemIndex}][description]" required></td>
    <td><input type="number" name="items[${itemIndex}][quantity]" min="1" value="1" required></td>
    <td><input type="number" name="items[${itemIndex}][price]" min="0" value="0" required></td>
    <td><input type="number" name="items[${itemIndex}][total]" value="0" readonly></td>
    <td><button type="button" class="removeItem">Remove</button></td>
  `;
  itemIndex++;
  attachRowEvents(row);
}

// Function to attach events to a row
function attachRowEvents(row) {
  const qtyInput = row.querySelector("input[name$='[quantity]']");
  const priceInput = row.querySelector("input[name$='[price]']");
  const removeBtn = row.querySelector(".removeItem");

  qtyInput.addEventListener("input", calculateTotals);
  priceInput.addEventListener("input", calculateTotals);
  removeBtn.addEventListener("click", () => {
    row.remove();
    calculateTotals();
  });
}

// Attach events to initial rows
Array.from(invoiceItemsTable.rows).forEach((row) => attachRowEvents(row));

// Event listeners
addItemBtn.addEventListener("click", addItemRow);
discountInput.addEventListener("input", calculateTotals);

// Initial calculation
calculateTotals();
