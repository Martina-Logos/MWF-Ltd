// Set current date and time
function setCurrentDateTime() {
  const now = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  document.getElementById("receiptDate").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
  document.getElementById("receiptTime").textContent = now.toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" }
  );

  // Generate receipt number (in a real app, this would come from the server)
  const receiptNumber =
    "RC-" +
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(Math.floor(Math.random() * 1000)).padStart(4, "0");
  document.getElementById("receiptNumber").textContent = receiptNumber;

  // Generate transaction reference
  const transactionRef =
    "TRX-" +
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "-" +
    String(Math.floor(Math.random() * 1000)).padStart(4, "0");
  document.getElementById("transactionRef").textContent = transactionRef;
}

// Calculate totals (in a real app, this would come from the sales data)
function calculateTotals() {
  // These values would normally come from the completed sale
  const subtotal = 4637.5;
  const transportFee = subtotal * 0.05;
  const tax = subtotal * 0.1;
  const total = subtotal + transportFee + tax;

  document.getElementById("subtotalAmount").textContent =
    "$" + subtotal.toFixed(2);
  document.getElementById("transportFee").textContent =
    "$" + transportFee.toFixed(2);
  document.getElementById("taxAmount").textContent = "$" + tax.toFixed(2);
  document.getElementById("totalAmount").textContent = "$" + total.toFixed(2);
}

// Print receipt function
function printReceipt() {
  window.print();
}

// Email receipt function
function emailReceipt() {
  const customerEmail = prompt(
    "Enter customer email address:",
    "customer@example.com"
  );
  if (customerEmail) {
    // In a real application, this would send the receipt via email
    alert(`Receipt has been sent to ${customerEmail}`);
  }
}

// Load receipt data from URL parameters (simulated)
function loadReceiptData() {
  // In a real application, this would load data from the completed sale
  // For demo purposes, we're using static data
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get("saleId");

  if (saleId) {
    // This would fetch sale data from the server in a real application
    document.getElementById("receiptNumber").textContent = "RC-" + saleId;
  }

  // Simulate loading customer data
  setTimeout(() => {
    // Data would come from the server in a real application
    document.getElementById("customerName").textContent =
      "BuildIT Constructions";
    document.getElementById("customerContact").textContent = "Robert Johnson";
    document.getElementById("customerPhone").textContent = "+1 (555) 987-6543";
    document.getElementById("customerAddress").textContent =
      "123 Construction Ave, Buildington";
    document.getElementById("salesAgent").textContent = "Sarah Johnson";
    document.getElementById("paymentMethod").textContent = "Bank Transfer";
  }, 100);
}

// Initialize the receipt
document.addEventListener("DOMContentLoaded", function () {
  setCurrentDateTime();
  calculateTotals();
  loadReceiptData();
});
