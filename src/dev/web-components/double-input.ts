class DoubleInput extends HTMLElement {
  inputField1: HTMLInputElement | null = null;
  inputField2: HTMLInputElement | null = null;
  connectedCallback() {
    const label = this.getAttribute('label') ?? "label_undefined";
    const value1 = this.getAttribute('value1') ?? "0";
    const value2 = this.getAttribute('value2') ?? "0";
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const step = this.getAttribute('step') ?? "1";
    const placeholder = this.getAttribute('placeholder') ?? "";
    const label1 = this.getAttribute('label1') ?? "";
    const label2 = this.getAttribute('label2') ?? "";

    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-2">
        <label class="block text-gray-400 text-xs mb-1">${label}</label>
        <div class="flex space-x-2">
          <div class="flex-1">
            ${label1 ? `<label class="block text-gray-400 text-xs">${label1}</label>` : ''}
            <input 
              type="number" 
              class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     appearance-none"
              placeholder="${placeholder}"
              value="${value1}"
              ${min !== null ? `min="${min}"` : ''}
              ${max !== null ? `max="${max}"` : ''}
              step="${step}"
            >
          </div>
          <div class="flex-1">
            ${label2 ? `<label class="block text-gray-400 text-xs">${label2}</label>` : ''}
            <input 
              type="number" 
              class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     appearance-none"
              placeholder="${placeholder}"
              value="${value2}"
              ${min !== null ? `min="${min}"` : ''}
              ${max !== null ? `max="${max}"` : ''}
              step="${step}"
            >
          </div>
        </div>
      </div>
    `;

    // Store the input elements as variables first
    const inputs = this.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    this.inputField1 = inputs[0];
    this.inputField2 = inputs[1];
  }

  // Getters and setters for values
  public get value1() {
    return Number(this.inputField1?.value);
  }
  public set value1(newValue) {
    if (this.inputField1) {
      this.inputField1.valueAsNumber = newValue;
    }
  }
  public get value2() {
    return Number(this.inputField2?.value);
  }
  public set value2(newValue) {
    if (this.inputField2) {
      this.inputField2.valueAsNumber = newValue;
    }
  }

  public subscribe(cb: (value1: number, value2: number) => void) {
    this.inputField1?.addEventListener('change', () => {
      cb(this.value1, this.value2);
    });
    this.inputField2?.addEventListener('change', () => {
      cb(this.value1, this.value2);
    });
  }
}

// Register the custom element
customElements.define('double-input', DoubleInput);

export { DoubleInput };