document.addEventListener("DOMContentLoaded", function () {
  // Tab functionality
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Show active tab content
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === tabId) {
          content.classList.add("active");
        }
      });
    });
  });

  // Form validation
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!firstName || !lastName || !email || !username || !password || !role) {
      alert("Please fill in all required fields");
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // In a real application, you would send the form data to the server here
    alert("User created successfully!");
    this.reset();
  });

  // Reset form
  document.getElementById("resetForm").addEventListener("click", function () {
    document.getElementById("userForm").reset();
  });

  // Delete user functionality
  const deleteModal = document.getElementById("deleteModal");
  const deleteButtons = document.querySelectorAll(".btn-delete");
  const closeModal = document.querySelector(".close");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-user");
      const userName = this.closest("tr").querySelector(
        ".user-info div:first-child"
      ).textContent;

      document.getElementById("deleteUserName").textContent = userName;
      deleteModal.style.display = "flex";

      // Store the user ID for deletion
      confirmDelete.setAttribute("data-user", userId);
    });
  });

  // Close modal
  closeModal.addEventListener("click", function () {
    deleteModal.style.display = "none";
  });

  cancelDelete.addEventListener("click", function () {
    deleteModal.style.display = "none";
  });

  confirmDelete.addEventListener("click", function () {
    const userId = this.getAttribute("data-user");

    // In a real application, you would send a delete request to the server here
    alert(`User with ID ${userId} has been deleted`);
    deleteModal.style.display = "none";

    // Remove the user from the table (for demo purposes)
    const userRow = document
      .querySelector(`.btn-delete[data-user="${userId}"]`)
      .closest("tr");
    userRow.remove();
  });

  // Edit user functionality
  const editButtons = document.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = this.getAttribute("data-user");
      const userRow = this.closest("tr");
      const userName = userRow.querySelector(
        ".user-info div:first-child"
      ).textContent;

      // In a real application, you would fetch user data and populate the form
      // For this demo, we'll just switch to the add user tab and show a message
      document.querySelector('.tab[data-tab="add-user"]').click();
      alert(
        `Edit mode for user: ${userName} (ID: ${userId}). User data would be loaded into the form.`
      );
    });
  });

  // Close modal if clicked outside
  window.addEventListener("click", function (e) {
    if (e.target === deleteModal) {
      deleteModal.style.display = "none";
    }
  });
});
