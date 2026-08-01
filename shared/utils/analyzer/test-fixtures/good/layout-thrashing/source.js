function resize() {
  const box = document.getElementById('box');
  const w = box.offsetWidth;
  requestAnimationFrame(() => {
    box.style.width = (w + 10) + 'px';
  });
}