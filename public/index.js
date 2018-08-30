$(document).ready(onReady);

let username, jwtToken;

function onReady() {
  checkAuthentication();
  $.getJSON("api/post", renderPosts).fail(showErr);
  $(".responses").on("click", ".delete-post-btn", onPostDeleteBtnClick);
  $(".responses").on("click", ".edit-btn", onPostClick);
  $(".logout").click(logoutUser);
}

// Handle displaying posts ///////////////////////////////////////////////
function renderPosts(posts) {
  const results = posts.map(postToHtml);
  $(".responses").html(results);
}

function postToHtml(post) {
  return `
  	<div class="post-summary" data-post-id="${post.id}">
			<h2>${post.title}</h2>
			<p><b>Created:</b> ${new Date(post.created).toLocaleString()}</p>
			<button class="edit-btn">Edit</button> <button class="delete-post-btn">Delete</button>
	</div>
    `;
}

function showErr(err) {
  const errMsg = '<p class="errMsg">😔 Sorry, something went wrong</p>';
  $(".responses").html(errMsg);
}

// Handle editing /////////////////////////////////////////////////////////
function onPostClick(event) {
  const postId = $(event.currentTarget).attr("data-post-id");
  window.open(`post/details.html?id=${postId}`, "_self");
}

// Handle deleting ///////////////////////////////////////////////////////
function onPostDeleteBtnClick(event) {
  event.stopImmediatePropagation();

  const postID = $(event.currentTarget)
    .closest(".post-summary")
    .attr("data-post-id");

  const userSaidYes = confirm("Are you sure you want to delete this response?");
  if (userSaidYes) {
    ajax({
      method: "delete",
      url: `/api/post/${postID}`,
      callback: () => {
        $(".edits").html(
          `<div class="successMsg center"><p><b>"${
            post.title
          }"</b> successfully deleted.<br />
        One moment please...</p></div>`
        );
        setTimeout(function() {
          $.getJSON("api/post", renderPosts);
        }, 3000);
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
      .html(`<p>Welcome <span class="uname">${username}</span>!</p>`)
      .removeAttr("hidden");
  } else {
    window.open("/login.html", "_self");
  }
}
