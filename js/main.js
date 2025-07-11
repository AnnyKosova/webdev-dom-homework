import { renderComments } from './render.js';
import { setupNewCommentHandler } from './eventHandlers.js';
import { getComments, setToken, login } from './api.js';
import { showLoader, hideLoader } from './loaders.js';

let user = null;
const app = document.getElementById('app');

export function setUser(newUser) {
  user = newUser;
  if (newUser) {
    setToken(newUser.token);
    localStorage.setItem('user', JSON.stringify(newUser));
  } else {
    setToken(null);
    localStorage.removeItem('user');
  }
  renderApp();
}

async function loadAndRenderComments() {
  try {
    showLoader('list', 'Загружаем комментарии...');
    const comments = await getComments();
    hideLoader('list');

    if (!comments || comments.length === 0) {
      showLoader('list', 'Пока нет комментариев. Будьте первым!');
      return;
    }

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

function renderLoginPage() {
  app.innerHTML = `
    <div class="login-container">
      <h1>Форма входа</h1>
      <div class="login-form">
        <input 
          type="text" 
          id="login-input" 
          placeholder="Логин" 
          value="admin" 
          autocomplete="username"
        />
        <input 
          type="password" 
          id="password-input" 
          placeholder="Пароль" 
          value="admin" 
          autocomplete="current-password"
        />
        <button id="login-button" class="add-form-button">Войти</button>
        <div id="login-error" class="error-message"></div>
        <a href="#" id="back-link" class="back-link">← Вернуться к комментариям</a>
      </div>
    </div>
  `;

  const passwordInput = document.getElementById('password-input');
  const loginInput = document.getElementById('login-input');
  loginInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') passwordInput.focus();
  });
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('login-button').click();
  });

  setTimeout(() => loginInput.focus(), 50);

  document
    .getElementById('login-button')
    .addEventListener('click', async () => {
      const errorElement = document.getElementById('login-error');
      errorElement.textContent = '';

      try {
        const userData = await login({
          login: loginInput.value.trim(),
          password: passwordInput.value.trim(),
        });

        setUser(userData);
        window.location.hash = '';
      } catch (error) {
        errorElement.textContent = error.message;
        passwordInput.focus();
      }
    });

  document.getElementById('back-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '';
  });
}

export function renderApp() {
  if (window.location.hash === '#login') {
    renderLoginPage();
    return;
  }

  app.innerHTML = `
    <div class="container">
      ${
        user
          ? `
        <div class="user-header">
          Вы вошли как ${user.name}
          <button id="logout-button" class="logout-button">Выйти</button>
        </div>
      `
          : ''
      }
      <ul class="comments" id="list"></ul>
      ${
        user
          ? `
        <div class="add-form">
          <input
            type="text"
            id="name"
            class="add-form-name"
            value="${user.name}"
            readonly
          />
          <textarea
            id="comment"
            class="add-form-text"
            placeholder="Введите ваш комментарий"
            rows="4"
          ></textarea>
          <div class="add-form-row">
            <button class="add-form-button" id="add">Написать</button>
          </div>
        </div>
      `
          : `
        <div class="auth-prompt">
          Чтобы добавить комментарий, <a href="#login" id="login-link">авторизуйтесь</a>.
        </div>
      `
      }
    </div>
  `;

  if (user) setupNewCommentHandler();

  document.getElementById('login-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = 'login';
  });

  document.getElementById('logout-button')?.addEventListener('click', () => {
    setUser(null);
  });

  loadAndRenderComments();
}

function initApp() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('user');
    }
  }

  window.addEventListener('hashchange', renderApp);
  renderApp();
}

initApp();
