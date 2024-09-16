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
  block.innerHTML = '';
  block.append(...body.childNodes);
  // append everything in the head to the document head
  document.head.append(...head.childNodes);
}
