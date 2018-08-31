$(document).ready(onReady);

let username, jwtToken;

function onReady() {
  checkAuthentication();
  $.getJSON("api/post", renderPosts).fail(showErr);
  $(".responses").on("click", ".delete-post-btn", onPostDelete);
  $(".responses").on("click", ".edit-btn", onPostEdit);
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
function onPostEdit(event) {
  const postId = $(event.currentTarget)
    .closest(".post-summary")
    .attr("data-post-id");
  window.open(`post/edit.html?id=${postId}`, "_self");
}

// Handle deleting ///////////////////////////////////////////////////////
function onPostDelete(event) {
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
          `<header role="banner">
              <h2>Your SERF Board</h2>
            </header>
            <div class="form-container">
              <div class="successMsg center">
                <p>Just a second, we\'ll get this deleted.<br />
              Stand by...</p>
              </div>
            </div>`
        );
        setTimeout(function() {
          window.location.reload(true);
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
