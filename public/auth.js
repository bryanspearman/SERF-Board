$(document).ready(onReady);

function onReady() {
  $("#sign-up-form").submit(onSignUpSubmit);
  $("#login-form").submit(onLoginSubmit);
  $(".nav").on("click", ".logout", function(event) {
    event.logout();
  });
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
        `<p class="center">User <b>"${
          user.username
        }"</b> successfully created. You may now log in.</p> <p class="center"><a href="login.html" target='_self'><button>Login</button></a></p>`
      );
    }
  });
}

function onLoginSubmit(event) {
  event.preventDefault();

  const userData = {
    name: $("#name-txt").val(),
    username: $("#username-txt").val(),
    password: $("#password-txt").val()
  };

  ajax({
    method: "POST",
    url: "/api/user/login",
    data: userData,
    callback: response => {
      localStorage.setItem("name", userData.name);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("jwtToken", response.authToken);
      window.open("./dashboard.html", "_self");
    }
  });
}
