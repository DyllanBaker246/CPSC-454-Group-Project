const adminPageLogoutButton = document.getElementById("admin-logout");

adminPageLogoutButton.addEventListener("click", function(){
    alert("button clicked");
    window.location.href = "../homePage.html";
});

const bar = document.getElementById('myBar');
// Update value dynamically
bar.value = 75; // Bar fills to 75%

