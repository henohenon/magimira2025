class InputAndSlider extends HTMLElement {
  inputField: HTMLInputElement | null = null;
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
    const slider = this.querySelector('input[type="range"]') as HTMLInputElement;
    this.inputField = this.querySelector('input[type="number"]') as HTMLInputElement;

    slider?.addEventListener('input', (_) => {
      if (!this.inputField) return;
      this.inputField.valueAsNumber = slider.valueAsNumber;
      // inputFieldのイベントを発火
      const event = new Event('input', { bubbles: true, cancelable: true });
      this.inputField.dispatchEvent(event);
    });

    // Update slider and display when input field changes
    this.inputField?.addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) {
        const newValue = e.target.value;

        // Update slider
        if (slider) {
          slider.value = newValue;
        }
      }
    });
  }

  get value() {
    return this.inputField?.valueAsNumber || NaN;
  }

  setValue(newValue: number) {
    if (this.inputField) {
      this.inputField.valueAsNumber = newValue;
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