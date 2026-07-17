const registerButton = document.getElementById("register-button");
const verifyButton = document.getElementById("verify-button");
const createAccountButton = document.getElementById("create-account-button");





if(registerButton){
    registerButton.addEventListener("click", function(){
        // alert("register");
        window.location.href = "./emailVerification.html";
    });    
}

if(verifyButton){
    verifyButton.addEventListener("click", function(){
        // alert("verify");
        window.location.href = "./password.html";
    });
}

if(createAccountButton){
    createAccountButton.addEventListener("click", function(){
        // alert("create account");
        window.location.href = "../index.html";
    });
}