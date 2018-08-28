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
    receivedMessage: $("#receivedMessage-txt").val(),
    userId: userId
  };

  // see public/utils.js
  ajax({
    method: "POST",
    url: "/api/post",
    data: newPost,
    jwtToken: jwtToken,
    callback: post => {
      $(".form-container").html(
        `<p class="center"><b>"${newPost.title}"</b> successfully saved.</p>`
      );
      setTimeout(function() {
        window.open(`/post/details.html?id=${post.id}`, "_self");
      }, 1000);
    }
  });
}

function logoutUser(event) {
  localStorage.removeItem("jwtToken");
  window.open("../login.html", "_self");
}

function checkAuthentication() {
  jwtToken = localStorage.getItem("jwtToken");
  if (jwtToken) {
    username = localStorage.getItem("username");
    $(".welcome")
      .html(`<p>Welcome <span class="uname">${username}</span></p>`)
      .removeAttr("hidden");
  } else {
    window.open("./login.html", "_self");
  }
}
