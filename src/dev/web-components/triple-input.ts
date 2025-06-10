class TripleInput extends HTMLElement {
  // Private properties to store input references
  private input1: HTMLInputElement | null = null;
  private input2: HTMLInputElement | null = null;
  private input3: HTMLInputElement | null = null;
  connectedCallback() {
    // Store all attributes as variables first
    const label = this.getAttribute('label') ?? "label_undefined";
    const value1 = this.getAttribute('value1') ?? "0";
    const value2 = this.getAttribute('value2') ?? "0";
    const value3 = this.getAttribute('value3') ?? "0";
    // Use shared properties like double-input
    const min = this.getAttribute('min');
    const max = this.getAttribute('max');
    const step = this.getAttribute('step') ?? "1";
    const placeholder = this.getAttribute('placeholder') ?? "";
    // Use separate properties for each input
    const label1 = this.getAttribute('label1') ?? "";
    const label2 = this.getAttribute('label2') ?? "";
    const label3 = this.getAttribute('label3') ?? "";

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
          <div class="flex-1">
            ${label3 ? `<label class="block text-gray-400 text-xs">${label3}</label>` : ''}
            <input 
              type="number" 
              class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     appearance-none"
              placeholder="${placeholder}"
              value="${value3}"
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
    this.input1 = inputs[0];
    this.input2 = inputs[1];
    this.input3 = inputs[2];
  }


  // Getters and setters for values
  get value1() {
    return this.input1?.valueAsNumber || NaN;
  }

  set value1(newValue: number) {
    if (this.input1) {
      this.input1.valueAsNumber = newValue;
    }
  }

  get value2() {
    return this.input2?.valueAsNumber || NaN;
  }

  set value2(newValue: number) {
    if (this.input2) {
      this.input2.valueAsNumber = newValue;
    }
  }

  get value3() {
    return this.input3?.valueAsNumber || NaN;
  }
  set value3(newValue: number) {
    if (this.input3) {
      this.input3.valueAsNumber = newValue;
    }
  }

  public subscribe(cb: (value1: number, value2: number, value3: number) => void) {
    this.input1?.addEventListener('change', () => {
      cb(this.value1, this.value2, this.value3);
    })
    this.input2?.addEventListener('change', () => {
      cb(this.value1, this.value2, this.value3);
    })
    this.input3?.addEventListener('change', () => {
      cb(this.value1, this.value2, this.value3);
    });
  }
}

// Register the custom element
customElements.define('triple-input', TripleInput);

export { TripleInput };
