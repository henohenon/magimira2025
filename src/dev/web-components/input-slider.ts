class InputAndSlider extends HTMLElement {
  inputField: HTMLInputElement | null = null;
  slider: HTMLInputElement | null = null;
  connectedCallback() {
    const label = this.getAttribute('label') ?? "label_undefined";
    const value = this.getAttribute('value') ?? "50";
    const min = this.getAttribute('min') ?? "0";
    const max = this.getAttribute('max') ?? "100";
    const step = this.getAttribute('step') ?? "1";

    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-2">
          <label>${label}</label>
          <input 
            type="range" 
            class="w-full bg-gray-600 text-white rounded 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   appearance-none"
            value="${value}"
            min="${min}"
            max="${max}"
            step="${step}"
          >
          <input 
            type="number" 
            class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   appearance-none"
            value="${value}"
            min="${min}"
            max="${max}"
            step="${step}"
          >
      </div>
    `;

    // Add event listeners to update both the slider and input field
    this.slider = this.querySelector('input[type="range"]') as HTMLInputElement;
    this.inputField = this.querySelector('input[type="number"]') as HTMLInputElement;

    if (!this.inputField || !this.slider) return;
    this.slider.addEventListener('input', () => {
      if (!this.inputField || !this.slider) return;
      this.inputField.valueAsNumber = this.slider.valueAsNumber;
      // inputFieldのイベントを発火
      const event = new Event('input', { bubbles: true, cancelable: true });
      this.inputField.dispatchEvent(event);
    });

    // Update slider and display when input field changes
    this.inputField.addEventListener('input', () => {
      if (!this.inputField || !this.slider) return;
      this.slider.value = this.inputField.value;
    });
  }

  get value() {
    if (!this.inputField) return NaN;
    return Number(this.inputField.value);
  }

  set value(newValue: number) {
    if (this.inputField) {
      this.inputField.valueAsNumber = newValue;
    }
  }

  set max(newValue: number) {
    if (this.inputField) {
      this.inputField.max = newValue.toString();
    }
    if (this.slider) {
      this.slider.max = newValue.toString();
    }
  }

  public subscribe(cb: (value: number) => void) {
    this.inputField?.addEventListener('input', (_) => {
      cb(this.value);
    });
  }
}

// Register the custom element
customElements.define('input-slider', InputAndSlider);

export { InputAndSlider };