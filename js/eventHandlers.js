import { comments } from './comments.js';
import { renderComments } from './render.js';
import { escapeHtml } from './escapeHtml.js';

export function initEventHandlers() {
  document.getElementById('list').addEventListener('click', handleCommentClick);
  document.addEventListener('click', handleLikeClick);
  document.getElementById('add').addEventListener('click', handleAddComment);
}

function handleCommentClick(e) {
  if (!e.target.classList.contains('like-button')) {
    const commentElement = e.target.closest('.comment');
    if (commentElement) {
      const index = commentElement.dataset.index;
      const comment = comments[index];
          
      const commentInput = document.getElementById('comment');
      commentInput.value = `> ${comment.name}: ${comment.text}\n`;
      commentInput.focus();
    }
  }
}

function handleLikeClick(e) {
  if (e.target.classList.contains('like-button')) {
    e.stopPropagation();
        
    const commentElement = e.target.closest('.comment');
    const index = commentElement.dataset.index;
        
    comments[index].isLiked = !comments[index].isLiked;
    comments[index].likes += comments[index].isLiked ? 1 : -1;
        
    renderComments(comments);
  }
}

function handleAddComment() {
  const nameInput = document.getElementById('name');
  const commentInput = document.getElementById('comment');
      
  if (!nameInput.value.trim() || !commentInput.value.trim()) {
    alert("Заполните имя и комментарий!");
    return;
  }

  const safeName = escapeHtml(nameInput.value.trim());
  const safeComment = escapeHtml(commentInput.value.trim());

  comments.push({
    name: safeName,
    date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0,5)}`,
    text: safeComment,
    likes: 0,
    isLiked: false
  });

  renderComments(comments);
      
  nameInput.value = '';
  commentInput.value = '';
}