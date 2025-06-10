class Accordion extends HTMLElement {
  connectedCallback() {
    const summary = this.getAttribute('summary') ?? "summary_undefined";
    const defaultOpen = this.hasAttribute('open');

    // 子要素を一旦キャッシュ（消える前に）
    const children = Array.from(this.childNodes);

    // HTML構造再構築
    this.innerHTML = `
      <details class="mb-2 bg-gray-700 rounded"${defaultOpen ? ' open' : ''}>
        <summary class="cursor-pointer px-3 py-2 hover:bg-gray-600">${summary}</summary>
        <div class="content p-1 pl-3 space-y-3"></div>
      </details>
    `;

    // .content に元の子要素を戻す
    const content = this.querySelector('.content');
    children.forEach(child => content?.appendChild(child));
  }
}

// Register the custom element
customElements.define('dev-accordion', Accordion);

export { Accordion };
