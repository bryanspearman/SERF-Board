let username, jwtToken;

$(document).ready(onReady);

function onReady() {
  checkAuthentication();
  $("#new-post-form").on("submit", onCreateSubmit);
  $(".logout").click(logoutUser);
}

function onCreateSubmit(event) {
  event.preventDefault();
  const newPost = {
    title: $("#title-txt").val(),
    response: $("#response-txt").val(),
    receivedMessage: $("#receivedMessage-txt").val()
  };

  // see public/utils.js
  ajax({
    method: "POST",
    url: "/api/post",
    data: newPost,
    jwtToken: jwtToken,
    callback: post => {
      $(".form-container").html(
        `<div class="successMsg center"><p><b>"${
          newPost.title
        }"</b> successfully saved.<br />
        One moment please...</p></div>`
      );
      setTimeout(function() {
        window.open("/dashboard.html", "_self");
      }, 4000);
    }
  });
}

function logoutUser() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
  window.open("/login.html", "_self");
}

function checkAuthentication() {
  jwtToken = localStorage.getItem("jwtToken");
  if (jwtToken) {
    username = localStorage.getItem("username");
    $(".welcome")
      .html(`<p>Welcome <span class="uname">${username}</span>!</p>`)
      .removeAttr("hidden");
  } else {
    window.open("./login.html", "_self");
  }
}
