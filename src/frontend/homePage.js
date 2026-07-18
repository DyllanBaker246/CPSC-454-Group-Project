const loginButton = document.getElementById('home-page-login-button');
const registerButton = document.getElementById('home-page-register-button');

if(loginButton){
    loginButton.addEventListener("click", function(){
        // alert("create account");
        window.location.href = "./index.html";
    });
}

if(registerButton){
    registerButton.addEventListener("click", function(){
        // alert("create account");
        window.location.href = "./register/register.html";
    });
}