
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");
    const loginButton = document.getElementById("loginButton");

    if (!loginForm || !message || !loginButton) {
        console.error("Login form elements not found.");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        message.textContent = "";

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
              credentials: "same-origin",  
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Invalid username or password.");
            }

            message.style.color = "green";
            message.textContent = "Login successful! Redirecting...";

            // Save basic user information for dashboard display
            sessionStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);

            message.style.color = "red";
            message.textContent = error.message;

            loginButton.disabled = false;
            loginButton.textContent = "Sign In";
        }

    });

});
