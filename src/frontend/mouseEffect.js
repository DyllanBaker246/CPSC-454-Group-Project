const mouseEffect = document.getElementById("mouse-effect");

document.addEventListener("mousemove", (e) => {
    mouseEffect.style.left = e.clientX + "px";
    mouseEffect.style.top = e.clientY + "px";
});


async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "userPage.html";
        } else {
            alert(data.error);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}