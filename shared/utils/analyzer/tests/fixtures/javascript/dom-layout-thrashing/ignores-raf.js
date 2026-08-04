function update() {
  requestAnimationFrame(() => {
    element.style.width = element.clientWidth + 10 + 'px'
  })
}
