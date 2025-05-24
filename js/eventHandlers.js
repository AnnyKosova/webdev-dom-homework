import { comments } from './comments.js';
import { renderComments } from './render.js';
import { escapeHtml } from './escapeHtml.js';

export function setupLikeHandlers() {
  document.querySelectorAll('.like-button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.closest('.comment').dataset.index;
      comments[index].isLiked = !comments[index].isLiked;
      comments[index].likes += comments[index].isLiked ? 1 : -1;
      renderComments();
    });
  });
}

export function setupQuoteHandlers() {
  document.querySelectorAll('.comment').forEach((comment) => {
    comment.addEventListener('click', (e) => {
      if (!e.target.classList.contains('like-button')) {
        const index = comment.dataset.index;
        document.getElementById('comment').value =
          `> ${comments[index].name}: ${comments[index].text}\n`;
      }
    });
  });
}

export function setupNewCommentHandler() {
  document.getElementById('add').addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');

    if (!nameInput.value.trim() || !commentInput.value.trim()) {
      alert('Заполните имя и комментарий!');
      return;
    }

    comments.push({
      name: escapeHtml(nameInput.value.trim()),
      date: new Date().toLocaleString().slice(0, 17),
      text: escapeHtml(commentInput.value.trim()),
      likes: 0,
      isLiked: false,
    });

    renderComments();
    nameInput.value = '';
    commentInput.value = '';
  });
}
