import { renderComments } from './render.js';
import { setupNewCommentHandler } from './eventHandlers.js';
import { getComments } from './api.js';

async function initApp() {
  try {
    const comments = await getComments();
    renderComments(comments);
    setupNewCommentHandler(comments);
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
    alert('Не удалось загрузить комментарии. Пожалуйста, попробуйте позже.');
  }
}

initApp();
