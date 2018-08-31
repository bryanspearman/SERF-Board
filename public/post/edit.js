let postID, username, jwtToken;

$(document).ready(onReady);

function onReady() {
  checkAuthentication();
  $.getJSON("/api/post", getPostDetails);
  $("#post-edit-form").on("submit", onEditSubmit);
  $(".form-container").on("click", ".noSave", onNoSave);
  $(".logout").click(logoutUser);
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
        <p>Ok your edits are saved!<br />
        We heading back to the list...</p>
        </div>`
      );
      setTimeout(function() {
        window.open("/dashboard.html", "_self");
      }, 4000);
    }
  });
}

function onNoSave() {
  window.open("/dashboard.html", "_self");
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
