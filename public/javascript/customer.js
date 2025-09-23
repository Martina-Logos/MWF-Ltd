document.addEventListener("DOMContentLoaded", function () {
  // Set today's date as default for customer since
  const today = new Date();
  document.getElementById("customerSince").value = today
    .toISOString()
    .split("T")[0];

  // Customer type selection
  const customerTypes = document.querySelectorAll(".customer-type");

  customerTypes.forEach((type) => {
    type.addEventListener("click", function () {
      // Remove selected class from all types
      customerTypes.forEach((t) => t.classList.remove("selected"));
      // Add selected class to clicked type
      this.classList.add("selected");

      // Update business type based on selection
      const selectedType = this.getAttribute("data-type");
      const businessTypeSelect = document.getElementById("businessType");

      // Map customer type to business type options
      const typeMap = {
        business: "construction",
        dealer: "furniture_dealer",
        manufacturer: "manufacturer",
        other: "other",
      };

      if (typeMap[selectedType]) {
        businessTypeSelect.value = typeMap[selectedType];
      }
    });
  });

  // Form validation
  document
    .getElementById("customerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic validation
      const companyName = document.getElementById("companyName").value;
      const businessType = document.getElementById("businessType").value;
      const contactPerson = document.getElementById("contactPerson").value;
      const phone = document.getElementById("phone").value;
      const streetAddress = document.getElementById("streetAddress").value;
      const city = document.getElementById("city").value;
      const country = document.getElementById("country").value;
      const paymentTerms = document.getElementById("paymentTerms").value;

      if (
        !companyName ||
        !businessType ||
        !contactPerson ||
        !phone ||
        !streetAddress ||
        !city ||
        !country ||
        !paymentTerms
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
        alert("Please enter a valid phone number");
        return;
      }

      // Email validation (if provided)
      const email = document.getElementById("email").value;
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address");
          return;
        }
      }

      // In a real application, you would send the form data to the server here
      alert("Customer added successfully!");
      this.reset();

      // Reset customer since date to today
      document.getElementById("customerSince").value = today
        .toISOString()
        .split("T")[0];
    });

  // Reset form
  document.getElementById("resetForm").addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      document.getElementById("customerForm").reset();
      // Reset customer since date to today
      document.getElementById("customerSince").value = today
        .toISOString()
        .split("T")[0];
      // Reset customer type selection
      customerTypes.forEach((t) => t.classList.remove("selected"));
      document
        .querySelector('.customer-type[data-type="business"]')
        .classList.add("selected");
    }
  });
});
