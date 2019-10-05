function checkPass() {
    if (document.getElementById('password').value == document.getElementById('confirmPassword').value) {
        document.getElementById('submit').disabled = false;
        // document.getElementById('message').innerHTML = 'matching';
    } else {
        document.getElementById('submit').disabled = true;
        // document.getElementById('message').innerHTML = ' not matching';
    }
}
checkPass();