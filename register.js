
document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");
    const registerButton = document.getElementById("registerButton");

    if (!registerForm || !message || !registerButton) {
        console.error("Registration form elements not found.");
        return;
    }

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirm_password = document.getElementById("confirm_password").value;

        message.textContent = "";

        // Validate fields
        if (!name || !username || !email || !password || !confirm_password) {
            message.style.color = "red";
            message.textContent = "All fields are required.";
            return;
        }

        if (password.length < 8) {
            message.style.color = "red";
            message.textContent = "Password must be at least 8 characters.";
            return;
        }

        if (password !== confirm_password) {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
            return;
        }

        registerButton.disabled = true;
        registerButton.textContent = "Registering...";

        try {

            // Send registration data to backend
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    email: email,
                    password: password,
                    confirm_password: confirm_password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Registration failed.");
            }

            message.style.color = "green";
            message.textContent = data.message || "Registration successful!";

            registerForm.reset();

            // Redirect to login page
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (error) {

            console.error("Registration error:", error);

            message.style.color = "red";
            message.textContent = error.message || "Cannot connect to server.";

        } finally {

            registerButton.disabled = false;
            registerButton.textContent = "Register";

        }

    });

});
