export const BASE_URL = 'https://wedev-api.sky.pro/api/v1/anny-kosova/comments';

export async function getComments() {
  try {
    const response = await fetch(BASE_URL);

    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже');
    }

    if (!response.ok) {
      throw new Error('Ошибка при загрузке комментариев');
    }

    const data = await response.json();
    return data.comments.map((comment) => ({
      ...comment,
      isLiked: comment.isLiked || false,
    }));
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Кажется у вас сломался интернет, попробуйте позже');
    }
    throw error;
  }
}

export async function postComment({ name, text }) {
  try {
    if (name.length < 3 || text.length < 3) {
      throw new Error('length_error');
    }

    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({
        name,
        text,
        forceError: true,
      }),
    });

    if (response.status === 400) {
      throw new Error('Имя и комментарий должны быть не короче 3 символов');
    }

    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже');
    }

    if (!response.ok) {
      throw new Error('Ошибка при отправке комментария');
    }

    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Кажется, у вас сломался интернет, попробуйте позже');
    }
    throw error;
  }
}
