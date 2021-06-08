/* global document */

const addScript = (src, key, value) => {
  const element = document.createElement('script')
  element.type = 'text/javascript'
  element.async = true
  element.src = src
  if (key) element.setAttribute(key, value)
  document.querySelectorAll('head')[0].append(element)
}

addScript('https://cdn.howuku.com/js/howu.js', 'key', '6oGbNAlraYnvOYxvJV54EL')
addScript('https://cdn.volument.com/v1/volument.js', 'onload', 'volument(\'92571bf2b1\')')
