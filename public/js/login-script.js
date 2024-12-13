document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();

            // Redirect based on role
            if (data.role === "Owner") {
                window.location.href = "/owner_dashboard";
            } else if (data.role === "Renter") {
                window.location.href = "/general_dashboard";
            } else if (data.role === "Admin") {
                window.location.href = "/admin_dashboard";
            }
        } else {
            const message = await response.text();
            alert(`Error: ${message}`);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An unexpected error occurred.");
    }
});