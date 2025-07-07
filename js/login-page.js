import { login } from './api.js';
import { renderApp } from './main.js';

export function renderLoginPage({ setUser }) {
  const app = document.getElementById('app');
  app.innerHTML = `
      <div class="login-container">
        <h1>Форма входа</h1>
        <input type="text" id="login-input" placeholder="Логин" />
        <input type="password" id="password-input" placeholder="Пароль" />
        <button id="login-button">Войти</button>
        <a href="/">← Назад к комментариям</a>
      </div>
    `;

  document
    .getElementById('login-button')
    .addEventListener('click', async () => {
      const loginInput = document.getElementById('login-input');
      const passwordInput = document.getElementById('password-input');
      const errorElement = document.getElementById('login-error');

      try {
        const user = await login({
          login: loginInput.value.trim(),
          password: passwordInput.value.trim(),
        });

        setUser(user);
        renderApp();
      } catch (error) {
        errorElement.textContent = error.message;
      }
    });
}
