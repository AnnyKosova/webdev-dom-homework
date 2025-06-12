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
    showLoader('list', 'Не удалось загрузить комментарии');
  }
}

function initApp() {
  loadAndRenderComments();
  setupNewCommentHandler();
}

initApp();
