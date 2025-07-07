export const BASE_URL = 'https://wedev-api.sky.pro/api/v2/anny-kosova';
export const USER_URL = 'https://wedev-api.sky.pro/api/user';

let token = null;

export function setToken(newToken) {
  token = newToken;
}

export async function getComments() {
  try {
    const response = await fetch(`${BASE_URL}/comments`);

    if (!response.ok) {
      throw new Error(
        response.status === 500
          ? 'Сервер сломался, попробуйте позже'
          : 'Ошибка при загрузке комментариев'
      );
    }

    return (await response.json()).comments;
  } catch (error) {
    throw new Error(
      error.message === 'Failed to fetch'
        ? 'Проблемы с интернет-соединением'
        : error.message
    );
  }
}

export async function postComment({ text }) {
  try {
    if (!token) throw new Error('Требуется авторизация');
    if (text.length < 3) throw new Error('Минимум 3 символа');

    const response = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Ошибка сервера');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Не удалось отправить комментарий');
  }
}

export async function login({ login, password }) {
  try {
    const response = await fetch(`${USER_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        login: login.trim(),
        password: password.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error('Неверный логин или пароль');
    }

    return (await response.json()).user;
  } catch (error) {
    throw new Error(
      error.message === 'Failed to fetch'
        ? 'Проблемы с соединением'
        : 'Ошибка авторизации'
    );
  }
}
export async function register({ login, name, password }) {
  try {
    const response = await fetch(`${USER_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        login: login.trim(),
        name: name.trim(),
        password: password.trim(),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Ошибка регистрации');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Не удалось зарегистрироваться');
  }
}
