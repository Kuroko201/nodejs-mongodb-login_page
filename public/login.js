function authentication(){
    const userIDInput = document.getElementById('userID');
    const passwordInput = document.getElementById('password');
    const userID = userIDInput.value;
    const password = passwordInput.value;
}

function reset(){
    const userIDInput = document.getElementById('userID');
    const passwordInput = document.getElementById('password');
    userIDInput.value = "";
    passwordInput.value = "";
}