export const BASE_URL = 'https://wedev-api.sky.pro/api/v1/anny-kosova/comments';

export async function getComments() {
  try {
    console.log('Запрашиваю комментарии...');
    const response = await fetch(BASE_URL);
    console.log('Ответ сервера:');

    if (!response.ok) {
      throw new Error('Ошибка при загрузке комментариев');
    }

    const data = await response.json();
    return data.comments.map((comment) => ({
      ...comment,
      isLiked: comment.isLiked || false,
    }));
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

export async function postComment({ name, text }) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ name, text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при отправке комментария');
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}
