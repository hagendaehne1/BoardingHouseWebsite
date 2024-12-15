document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok) {
            // Store the JWT token in localStorage
            localStorage.setItem('token', data.token)

            document.cookie = `token=${data.token}; path=/; SameSite=Strict`;

            // Redirect based on role
            if (data.role === "Owner") {
                window.location.href = "/owner_dashboard"
            } else if (data.role === "Renter") {
                window.location.href = "/user_dashboard"
            } else if (data.role === "Admin") {
                window.location.href = "/admin_dashboard"
            }
        } else {
            // Display error message from the server
            alert(`Error: ${data.error}`)
        }
    } catch (err) {
        console.error("Error:", err)
        alert("An unexpected error occurred.")
    }
})