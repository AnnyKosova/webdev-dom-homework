import { renderComments } from './render.js';
import { setupNewCommentHandler } from './eventHandlers.js';
import { getComments } from './api.js';
import { showLoader, hideLoader } from './loaders.js';

async function loadAndRenderComments() {
  try {
    showLoader('list', 'Пожалуйста подождите, загружаю комментарии...');
    const comments = await getComments();
    hideLoader('list');
    renderComments(comments);
  } catch (error) {
    console.error('Ошибка:', error);
    showLoader('list', error.message);

    const retryButton = document.createElement('button');
    retryButton.textContent = 'Попробовать снова';
    retryButton.className = 'add-form-button';
    retryButton.style.marginTop = '10px';
    retryButton.addEventListener('click', loadAndRenderComments);

    const loader = document.querySelector('.loader');
    if (loader) {
      loader.appendChild(document.createElement('br'));
      loader.appendChild(retryButton);
    }
  }
}

function initApp() {
  loadAndRenderComments();
  setupNewCommentHandler();
}

initApp();
