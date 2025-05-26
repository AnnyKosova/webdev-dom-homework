import { comments } from './comments.js';
import { setupLikeHandlers, setupQuoteHandlers } from './eventHandlers.js';

export function renderComments() {
  const list = document.getElementById('list');

  const htmlComments = comments
    .map(
      (comment, index) => `
    <li class="comment" data-index="${index}">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">${comment.text}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
        </div>
      </div>
    </li>
      `
    )
    .join('');

  list.innerHTML = htmlComments;
  setupLikeHandlers();
  setupQuoteHandlers();
}
