document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                firstName, 
                lastName, 
                role, 
                email, 
                password, 
                confirmPassword 
            }),
        });

        const message = await response.text();
        if (response.ok) {
            alert(message);
            window.location.href = "/login";
        } else {
            alert(`Error: ${message}`);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An unexpected error occurred.");
    }
});