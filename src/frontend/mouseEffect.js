const mouseEffect = document.getElementById("mouse-effect");

document.addEventListener("mousemove", (e) => {
    mouseEffect.style.left = e.clientX + "px";
    mouseEffect.style.top = e.clientY + "px";
});