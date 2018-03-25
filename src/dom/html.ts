export const html = (htmlString: string) => {
  const div = document.createElement('div')
  div.innerHTML = htmlString.trim()
  return (<Node>div.firstChild).cloneNode(true)
}
