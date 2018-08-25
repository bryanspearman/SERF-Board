$(document).ready(onReady);

function onReady() {
  $("#sign-up-form").submit(onSignUpSubmit);
  $("#login-form").submit(onLoginSubmit);
}

function onSignUpSubmit(event) {
  event.preventDefault();

  const userData = {
    name: $("#name-txt").val(),
    username: $("#username-txt").val(),
    password: $("#password-txt").val()
  };

  ajax({
    method: "POST",
    url: "/api/user",
    data: userData,
    callback: user => {
      $(".form-container").html(
        `<p>User "${
          user.username
        }" created, you may now log in.</p> <p><a href="login.html" target='_self'><button class="signIn-btn">Login</button></a></p>`
      );
    }
  });
}

function onLoginSubmit(event) {
  event.preventDefault();

  const userData = {
    username: $("#username-txt").val(),
    password: $("#password-txt").val()
  };

  ajax({
    method: "POST",
    url: "/api/user/login",
    data: userData,
    callback: response => {
      localStorage.setItem("username", userData.username);
      localStorage.setItem("jwtToken", response.authToken);
      window.open("/dashboard.html", "_self");
    }
  });
}
