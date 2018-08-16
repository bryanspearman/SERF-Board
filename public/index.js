$(function placeHolderContent() {
  $(".dynamic-1").append(
    `<ul>
      <li>
        <p class="response-list-titles">Response Title 1</p>
        <p class="response-list-blurps">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis...</p>
      </li>
      <li>
        <p class="response-list-titles">Response Title 2</p>
        <p class="response-list-blurps">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis...</p>
      </li>
      <li>
        <p class="response-list-titles">Response Title 3</p>
        <p class="response-list-blurps">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis...</p>
      </li>
    </ul>`
  );
  $(".dynamic-2").append(
    "<p><em>jQuery here. Just adding some text to the DOM, don't mind me</em></p>"
  );
});

$(placeHolderContent);
