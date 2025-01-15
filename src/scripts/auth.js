// Dummy credentials
const validCredentials = {
    username: "user123",
    password: "password123"
    name: "Sam"
};

// List of home pages
const homePages = ["admin.html", "resident.html"];

// Login form handling
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Get input values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check credentials
    if (username === validCredentials.username && password === validCredentials.password) {
        // Redirect to a random home page
        const randomHome = homePages[Math.floor(Math.random() * homePages.length)];
        window.location.href = randomHome;
    } else {
        // Show error message
        document.getElementById("error-message").classList.remove("hidden");
    }
});
