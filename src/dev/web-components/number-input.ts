class NumberInput extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') ?? "label_undefined";
    const placeholder = this.getAttribute('placeholder') ?? "";
    const value = this.getAttribute('value') ?? "";
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const step = this.getAttribute('step') ?? "1";

    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-2">
        <label class="block text-gray-400 text-xs mb-1">${label}</label>
        <input 
          type="number" 
          class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   appearance-none"
          placeholder="${placeholder}"
          value="${value}"
          ${min !== null ? `min="${min}"` : ''}
          ${max !== null ? `max="${max}"` : ''}
          step="${step}"
        >
      </div>
    `;
  }
}

// Register the custom element
customElements.define('number-input', NumberInput);

export { NumberInput };