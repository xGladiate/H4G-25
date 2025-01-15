// Dummy credentials
const validCredentials = {
    username: "resident123",
    password: "password123"
};

const adminCredentials = {
    username: "admin123",
    password: "password123"
};

// Login form handling
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Get input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check credentials
    if (username === validCredentials.username && password === validCredentials.password) {
        localStorage.setItem("isLoggedIn", true);
        window.location.href = "resident.html";
    } else if (username === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem("isLoggedIn", true);
        window.location.href = "admin.html";
    } else {
        // Show error message
        document.getElementById("error-message").classList.remove("hidden");
    }
});
