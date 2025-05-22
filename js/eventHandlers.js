import { comments } from './comments.js';
import { renderComments } from './render.js';
import { escapeHtml } from './escapeHtml.js';

const commentHandlers = new WeakMap();

export function initEventHandlers() {
  document.getElementById('add').addEventListener('click', handleAddComment);
}

export function setupCommentHandlers() {
  document.querySelectorAll('.comment').forEach(comment => {
    if (commentHandlers.has(comment)) return;

    const likeButton = comment.querySelector('.like-button');
    
    const likeHandler = (e) => {
      e.stopPropagation();
      const index = comment.dataset.index;
      comments[index].isLiked = !comments[index].isLiked;
      comments[index].likes += comments[index].isLiked ? 1 : -1;
      
      updateCommentInDOM(index);
    };
    
    const commentHandler = (e) => {
      if (e.target.classList.contains('like-button')) return;
      const index = comment.dataset.index;
      quoteComment(index);
    };

    likeButton.addEventListener('click', likeHandler);
    comment.addEventListener('click', commentHandler);
    
    commentHandlers.set(comment, { likeHandler, commentHandler });
  });
}

function updateCommentInDOM(index) {
  const comment = comments[index];
  const commentElement = document.querySelector(`.comment[data-index="${index}"]`);
  
  if (commentElement) {
    commentElement.querySelector('.likes-counter').textContent = comment.likes;
    commentElement.querySelector('.like-button').className = 
      `like-button ${comment.isLiked ? '-active-like' : ''}`;
  }
}

function quoteComment(index) {
  const comment = comments[index];
  const commentInput = document.getElementById('comment');
  commentInput.value = `> ${comment.name}: ${comment.text}\n`;
  commentInput.focus();
}

function handleAddComment() {
  const nameInput = document.getElementById('name');
  const commentInput = document.getElementById('comment');
  
  if (!nameInput.value.trim() || !commentInput.value.trim()) {
    alert('Заполните имя и комментарий!');
    return;
  }

  comments.push({
    name: escapeHtml(nameInput.value.trim()),
    date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString().slice(0,5)}`,
    text: escapeHtml(commentInput.value.trim()),
    likes: 0,
    isLiked: false
  });

  renderComments(comments);
  nameInput.value = '';
  commentInput.value = '';
}