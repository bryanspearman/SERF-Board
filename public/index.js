$(document).ready(onReady);

let username, jwtToken;

function onReady() {
  checkAuthentication();
  getCorrectPosts();
  // $.getJSON("api/post", renderPosts);
  $(".responses").on("click", ".delete-post-btn", onPostDeleteBtnClick);
  $(".responses").on("click", ".edit-btn", onPostClick);
  $(".logout").click(logoutUser);
}

function getCorrectPosts(posts) {
  jwtToken = localStorage.getItem("jwtToken");

  ajax({
    method: "GET",
    url: "/api/post",
    data: posts,
    jwtToken: jwtToken,
    callback: post => {
      renderPosts(post);
    }
  });
}

function renderPosts(posts) {
  $(".responses").html(posts.map(postToHtml));
}

function postToHtml(post) {
  let deleteButton = "";
  let editButton = "";
  if (post.user === request.user._id) {
    deleteButton = '<button class="delete-post-btn">Delete</button>';
    editButton = '<button class="edit-btn">Edit</button>';
  }
  return `
  	<div class="post-summary" data-post-id="${post.id}">
			<h2>${post.title}</h2>
			<p>${post.response}</p>
			<p><b>Created:</b> ${new Date(post.created).toLocaleString()}</p>
			${editButton} ${deleteButton}
	</div>
    `;
}

// Handle editing
function onPostClick(event) {
  const postId = $(event.currentTarget).attr("data-post-id");
  window.open(`post/details.html?id=${postId}`, "_self");
}

// Handle deleting
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
        $(".responses").html(
          `<p class="center"><b>"${post.title}"</b>, successfully deleted</p>`
        );
        setTimeout(function() {
          $.getJSON("api/post", renderPosts);
        }, 1000);
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
