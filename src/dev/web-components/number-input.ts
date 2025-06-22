class NumberInput extends HTMLElement {
  inputField: HTMLInputElement | null = null;
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
        <label>${label}</label>
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
    this.inputField = this.querySelector('input');
  }

  get value() {
    return Number(this.inputField?.value);
  }
  set value(newValue: number) {
    if (this.inputField && !this.inputField.matches(':focus')) {
      this.inputField.valueAsNumber = newValue;
    }
  }

  public subscribe(cb: (value: number) => void) {
    this.inputField?.addEventListener('change', () => {
      cb(this.value);
    });
  }
}

// Register the custom element
customElements.define('number-input', NumberInput);

export { NumberInput };
