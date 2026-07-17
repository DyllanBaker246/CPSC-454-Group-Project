const userPageLogoutButton = document.getElementById("user-logout");

userPageLogoutButton.addEventListener("click", function(){
    alert("button clicked");
    window.location.href = "./homePage.html";
});