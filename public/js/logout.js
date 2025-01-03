document.addEventListener("DOMContentLoaded", function () {
    // Attach click event to the logout button
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior

        // Clear localStorage
        localStorage.clear();

        // Redirect to /api/ page
        window.location.href = "/api/";
    });
});