$(document).ready(onReady);

let username, jwtToken;

function onReady() {
  checkAuthentication();
  $.getJSON("api/post", renderPosts);
  $(".responses").on("click", ".delete-post-btn", onPostDeleteBtnClick);
  $(".responses").on("click", ".edit-btn", onPostClick);
}

function renderPosts(posts) {
  $(".responses").html(posts.map(postToHtml));
}

function postToHtml(post) {
  let deleteButton = "";
  let editButton = "";
  if (post.userId === req.user.userId) {
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

// Handle opening post details
function onPostClick(event) {
  const postId = $(event.currentTarget).attr("data-post-id");
  window.open(`post/details.html?id=${postId}`, "_self");
}

// Handle deleting posts
function onPostDeleteBtnClick(event) {
  /**
   * Because "onPostDeleteClick" and "onPostClick" both are listening for clicks inside of
   * #post-summary element, we need to call event.stopImmediatePropagation to avoid both
   * event listeners firing when we click on the delete button inside #post-summary.
   */
  event.stopImmediatePropagation();
  // Step 1: Get the post id to delete from it's parent.
  const postID = $(event.currentTarget)
    .closest("#post-summary")
    .attr("data-post-id");
  // Step 2: Verify use is sure of deletion
  const userSaidYes = confirm("Are you sure you want to delete this response?");
  if (userSaidYes) {
    // Step 3: Make ajax call to delete post
    ajax({
      method: "delete",
      url: `/api/post/${postID}`,
      callback: () => {
        // Step 4: If succesful, reload the posts list
        alert("Response deleted succesfully, reloading results ...");
        $.getJSON("api/post", renderPosts);
      }
    });
  }
}

function checkAuthentication() {
  jwtToken = localStorage.getItem("jwtToken");
  if (jwtToken) {
    username = localStorage.getItem("username");
    $("#nav-welcome")
      .html(`Welcome ${username}`)
      .removeAttr("hidden");
    $("#nav-create").removeAttr("hidden");
  } else {
    $("#nav-login").removeAttr("hidden");
  }
}
