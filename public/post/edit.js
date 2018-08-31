let postID, username, jwtToken;

$(document).ready(onReady);

function onReady() {
  checkAuthentication();
  accordion();
  getPosts();
  $("#post-edit-form").on("submit", onEditSubmit);
  $(".logout").click(logoutUser);
}

function getPosts() {
  ajax({
    type: "GET",
    url: "/api/post",
    jwtToken: jwtToken,
    callback: getPostDetails
  });
}

function getPostDetails(posts) {
  postID = getQueryStringParam("id");
  console.log(postID);
  const postToRender = posts.find(post => post.id == postID);
  renderPost(postToRender);
}

function renderPost(post) {
  $("#title-txt").val(post.title);
  $("#response-txt").val(post.response);
  $("#receivedMessage-txt").val(post.receivedMessage);
}

function onEditSubmit(event) {
  event.preventDefault();
  const newPost = {
    title: $("#title-txt").val(),
    response: $("#response-txt").val(),
    receivedMessage: $("#receivedMessage-txt").val()
  };

  ajax({
    method: "PUT",
    url: `/api/post/${postID}`,
    data: newPost,
    jwtToken: jwtToken,
    callback: post => {
      $(".form-container").html(
        `<div class="successMsg center">
        <h2>Your edits are saved!</h2>
        <p>Heading back to the list...</p>
        </div>`
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
      .html(
        `<p>Let\'s edit this thing <span class="uname">${username}</span>!</p>`
      )
      .removeAttr("hidden");
  } else {
    window.open("/login.html", "_self");
  }
}
