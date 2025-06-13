export function showLoader(containerId, text) {
  const container = document.getElementById(containerId);
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.textContent = text;
  container.innerHTML = '';
  container.appendChild(loader);
}

export function hideLoader(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
}
