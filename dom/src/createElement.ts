export const createElement = (selector: string) => {
  const [type, ...css] = selector.split('.')
  const elm = document.createElement(type)
  for (var i = 0; i < css.length; i++) {
    elm.classList.add(css[i])
  }
  return elm
}
