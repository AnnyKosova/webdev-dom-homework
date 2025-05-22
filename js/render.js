import { escapeHtml } from './escapeHtml.js';
import { setupCommentHandlers } from './eventHandlers.js';

const listElement = document.getElementById('list');
const commentTemplate = document.createElement('template');

export function renderComments(comments) {
  const scrollPosition = listElement.scrollTop;
  
  if (shouldFullRender(comments)) {
    listElement.innerHTML = '';
    comments.forEach((comment, index) => {
      listElement.appendChild(createCommentElement(comment, index));
    });
  } else {
    comments.forEach((comment, index) => {
      updateExistingComment(comment, index);
    });
  }
  
  listElement.scrollTop = scrollPosition;
  
  setupCommentHandlers();
}

function shouldFullRender(comments) {
  return listElement.children.length !== comments.length ||
         Array.from(listElement.children).some((el, i) => 
           el.dataset.index !== i.toString()
         );
}

function createCommentElement(comment, index) {
  commentTemplate.innerHTML = `
    <li class="comment" data-index="${index}">
      <div class="comment-header">
        <div>${escapeHtml(comment.name)}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">${escapeHtml(comment.text)}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
        </div>
      </div>
    </li>
  `;
  return commentTemplate.content.firstElementChild.cloneNode(true);
}

function updateExistingComment(comment, index) {
  const existingElement = listElement.querySelector(`[data-index="${index}"]`);
  if (existingElement) {
    const likesCounter = existingElement.querySelector('.likes-counter');
    const likeButton = existingElement.querySelector('.like-button');
    
    if (likesCounter.textContent !== comment.likes.toString()) {
      likesCounter.textContent = comment.likes;
    }
    
    const newButtonClass = `like-button ${comment.isLiked ? '-active-like' : ''}`;
    if (likeButton.className !== newButtonClass) {
      likeButton.className = newButtonClass;
    }
  }
}