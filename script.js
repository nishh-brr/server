function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  const validUser = "admin";
  const validPass = "1234";

  if (!username || !password) {
    message.textContent = "Please fill all fields";
    message.className = "error";
    return;
  }

  if (username === validUser && password === validPass) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    message.textContent = "Invalid username or password";
    message.className = "error";
  }
}