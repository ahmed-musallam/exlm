function executeScript(oldScript) {
  const newScript = document.createElement('script');
  if (oldScript.src) {
    newScript.src = oldScript.src;
    newScript.type = oldScript.type || 'text/javascript';
  } else {
    newScript.textContent = oldScript.textContent;
  }
  document.head.appendChild(newScript);
}

/**
 *
 * @param {HTMLElement} block
 */
export default async function decorate(block) {
  const props = [...block.children].map((row) => row.firstElementChild);
  const htmlIndexUrl = props[0]?.textContent;

  const response = await fetch(htmlIndexUrl);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const { body, head } = doc;
  // clear block:
  block.innerHTML = '';

  const appDiv = document.createElement('div');
  // copy all attributes on body to block
  // eslint-disable-next-line no-restricted-syntax
  for (const { name, value } of body.attributes) {
    appDiv.setAttribute(name, value);
  }
  appDiv.append(...body.querySelector('main').children);
  block.append(appDiv);
  // append everything in the head to the document head
  [...head.children].forEach((child) => {
    if (child.tagName === 'SCRIPT') {
      executeScript(child);
    } else {
      document.head.appendChild(child);
    }
  });
}
