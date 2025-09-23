document
  .getElementById("addProductForm")
  .addEventListener("submit", function (e) {
    // e.preventDefault();

    // Basic form validation
    const productName = document.getElementById("productName").value;
    const productType = document.getElementById("productType").value;
    const costPrice = document.getElementById("costPrice").value;
    const sellingPrice = document.getElementById("sellingPrice").value;
    const quantity = document.getElementById("quantity").value;
    const supplierName = document.getElementById("supplierName").value;
    const quality = document.getElementById("quality").value;

    if (
      !productName ||
      !productType ||
      !costPrice ||
      !sellingPrice ||
      !quantity ||
      !supplierName ||
      !quality
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if selling price is greater than cost price
    if (parseFloat(sellingPrice) <= parseFloat(costPrice)) {
      alert("Selling price must be greater than cost price");
      return;
    }

    // In a real application, you would send the form data to the server here
    // For this example, we'll just show a success message
    alert("Product added successfully!");
    this.reset();
  });

// Simple navigation simulation
document.querySelector(".btn-outline").addEventListener("click", function () {
  if (
    confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost."
    )
  ) {
    // In a real application, this would redirect to the dashboard
    alert("Redirecting to dashboard...");
  }
});
