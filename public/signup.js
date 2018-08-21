"use strict";

function checkPass() {
  var pass1 = document.getElementById("pass1");
  var pass2 = document.getElementById("pass2");
  var message = document.getElementById("confirmMessage");
  var goodColor = "#66cc66";
  var badColor = "#ff6666";

  if (pass1.value === pass2.value) {
    pass2.style.backgroundColor = goodColor;
    message.style.color = goodColor;
    message.innerHTML = "Passwords Match!";
  } else {
    pass2.style.backgroundColor = badColor;
    message.style.color = badColor;
    message.innerHTML = "Passwords Do Not Match!";
  }
}

const signUpURL = "https://gentle-lake-36024.herokuapp.com/api/users";

function postAccountInfo(userData, callback) {
  const settings = {
    url: signUpURL,
    data: {
      userName: userData.userName,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    },
    dataType: "json",
    type: "POST",
    success: callback
  };
  $.ajax(settings);
}

function signUpCallback() {
  window.location = "/login.html";
}

function createAccount() {
  $(".js-signUp-form").submit(event => {
    event.preventDefault();
    const queryFirstName = document.getElementById("firstName").value;
    const queryLastName = document.getElementById("lastName").value;
    const queryUserName = document.getElementById("userName").value;
    const queryPassword = document.getElementById("pass2").value;
    const userData = {
      firstName: queryFirstName,
      lastName: queryLastName,
      userName: queryUserName,
      password: queryPassword
    };
    postAccountInfo(userData, signUpCallback);
  });
}

$(createAccount);
