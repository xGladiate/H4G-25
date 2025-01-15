import supabase from "./supabase.js";
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const { data: users, error } = await supabase
        .from("credentials")
        .select("role")
        .eq("username", username)
        .eq("password", password);

    if (error || users.length === 0) {
        alert("Invalid username or password.");
        return;
    }

    const role = users[0].role;

    if (role == 'ADMIN') {
        window.location.href = "admin.html";
    } else if (role == 'RESIDENT') {
        window.location.href = "resident.html";
    } else {
        alert("Unknown user role.");
    }
});