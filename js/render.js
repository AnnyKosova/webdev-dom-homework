import { setupLikeHandlers, setupQuoteHandlers } from './eventHandlers.js';

export function renderComments(comments) {
  const list = document.getElementById('list');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('ru-RU') +
      ', ' +
      date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const htmlComments = comments
    .map(
      (comment, index) => `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.author.name}</div>
          <div>${formatDate(comment.date)}</div>
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
  setupLikeHandlers(comments);
  setupQuoteHandlers(comments);
}
