import { comments } from './comments.js';
import { renderComments } from './render.js';
import { initEventHandlers } from './eventHandlers.js';

function initApp() {
  renderComments(comments); 
  initEventHandlers(); 
}

initApp();