export function setDragCursor(value: boolean) {
  const html = document.getElementsByTagName('html').item(0)
  html.classList.toggle('grabbing', value)
}