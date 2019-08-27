export default function toast (text, delay = 2000) {
  let node = document.createElement('div')
  node.setAttribute('class', 'toast')
  node.innerHTML = text
  document.body.appendChild(node)
  setTimeout(function () {
    document.body.removeChild(node)
  }, delay)
}
