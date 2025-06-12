import { renderComments } from './render.js';
import { postComment, getComments } from './api.js';

export function setupLikeHandlers(comments) {
  document.querySelectorAll('.like-button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = e.target.closest('.comment').dataset.index;
      comments[index].isLiked = !comments[index].isLiked;
      comments[index].likes += comments[index].isLiked ? 1 : -1;
      renderComments(comments);
    });
  });
}

export function setupQuoteHandlers(comments) {
  document.querySelectorAll('.comment').forEach((comment) => {
    comment.addEventListener('click', (e) => {
      if (!e.target.classList.contains('like-button')) {
        const index = comment.dataset.index;
        document.getElementById('comment').value =
          `> ${comments[index].author.name}: ${comments[index].text}\n`;
      }
    });
  });
}

export async function setupNewCommentHandler() {
  document.getElementById('add').addEventListener('click', async () => {
    const form = document.querySelector('.add-form');
    const nameInput = document.getElementById('name');
    const commentInput = document.getElementById('comment');

    if (!nameInput.value.trim() || !commentInput.value.trim()) {
      alert('Заполните имя и комментарий!');
      return;
    }

    try {
      const loadingMessage = document.createElement('div');
      loadingMessage.className = 'loading-message';
      loadingMessage.textContent = 'Комментарий добавляется...';
      form.parentNode.insertBefore(loadingMessage, form);
      form.style.display = 'none';

      await postComment({
        name: nameInput.value.trim(),
        text: commentInput.value.trim(),
      });

      const updatedComments = await getComments();
      renderComments(updatedComments);

      nameInput.value = '';
      commentInput.value = '';
    } catch (error) {
      alert(error.message);
    } finally {
      const loadingMessage = document.querySelector('.loading-message');
      if (loadingMessage) {
        loadingMessage.remove();
      }
      form.style.display = 'flex';
    }
  });
}
