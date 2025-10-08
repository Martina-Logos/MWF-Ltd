// Customer form handling
document.addEventListener("DOMContentLoaded", function () {
  const customerForm = document.getElementById("customerForm");
  const customerTypeCards = document.querySelectorAll(".customer-type");
  const businessTypeSelect = document.getElementById("businessType");
  const resetButton = document.getElementById("resetForm");

  // Handle customer type selection (visual only)
  customerTypeCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove selected class from all cards
      customerTypeCards.forEach((c) => c.classList.remove("selected"));

      // Add selected class to clicked card
      this.classList.add("selected");

      // Update business type dropdown based on selection
      const type = this.dataset.type;
      switch (type) {
        case "business":
          businessTypeSelect.value = "construction";
          break;
        case "dealer":
          businessTypeSelect.value = "furniture_dealer";
          break;
        case "manufacturer":
          businessTypeSelect.value = "manufacturer";
          break;
        case "other":
          businessTypeSelect.value = "other";
          break;
      }
    });
  });

  // Handle form reset
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear all fields?")) {
        customerForm.reset();
        // Reset to default selection
        customerTypeCards.forEach((c) => c.classList.remove("selected"));
        customerTypeCards[0].classList.add("selected");
      }
    });
  }

  // Form validation and submission
  customerForm.addEventListener("submit", function (e) {
    // Let the form submit naturally - don't prevent default
    console.log("Form submitting...");

    // Basic validation
    const companyName = document.getElementById("companyName").value.trim();
    const contactPerson = document.getElementById("contactPerson").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const streetAddress = document.getElementById("streetAddress").value.trim();
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();
    const businessType = businessTypeSelect.value;
    const paymentTerms = document.getElementById("paymentTerms").value;

    if (
      !companyName ||
      !contactPerson ||
      !phone ||
      !streetAddress ||
      !city ||
      !country ||
      !businessType ||
      !paymentTerms
    ) {
      e.preventDefault();
      alert("Please fill in all required fields (marked with *)");
      return false;
    }

    // Show loading state
    const submitButton = customerForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Adding Customer...';
  });

  // Phone number formatting (optional)
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      // Remove any non-numeric characters except + and -
      let value = e.target.value.replace(/[^\d+\-\s()]/g, "");
      e.target.value = value;
    });
  }

  // Email validation (optional)
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function (e) {
      const email = e.target.value.trim();
      if (email && !isValidEmail(email)) {
        alert("Please enter a valid email address");
        e.target.focus();
      }
    });
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
