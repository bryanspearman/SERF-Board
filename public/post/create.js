let username, jwtToken;

$(document).ready(onReady);

function onReady() {
  checkAuthentication();
  accordion();
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

  ajax({
    method: "POST",
    url: "/api/post",
    data: newPost,
    jwtToken: jwtToken,
    callback: post => {
      $(".form-container").html(
        `
        <div class="successMsg center">
        <h2>Great job!</h2>
        <p>Back to the list we go...</p>
        </div>
        `
      );
      setTimeout(function() {
        window.open("/dashboard.html", "_self");
      }, 3000);
    }
  });
}

function accordion() {
  const acc = document.getElementsByClassName("accordion");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
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
      .html(`<p>Let\'s do this <span class="uname">${username}</span>!</p>`)
      .removeAttr("hidden");
  } else {
    window.open("/login.html", "_self");
  }
}
