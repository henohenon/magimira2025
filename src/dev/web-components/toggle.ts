class Toggle extends HTMLElement {
  checkbox: HTMLInputElement | null = null;
  dot: HTMLElement | null = null;
  connectedCallback() {
    const label = this.getAttribute('label') ?? "label_undefined";
    const checked = this.hasAttribute('checked');
    const name = this.getAttribute('name') ?? "";
    
    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-2">
        <label class="flex items-center cursor-pointer">
          <div class="block text-gray-400 text-xs mr-2">${label}</div>
            <input 
              type="checkbox" 
              class="sr-only"
              ${checked ? 'checked' : ''}
              name="${name}"
            >
          <div class="relative">
            <div class="w-10 h-5 bg-gray-600 rounded-full"></div>
            <div class="dot absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition transform ${checked ? 'translate-x-5 bg-blue-400' : ''}"></div>
          </div>
        </label>
      </div>
    `;

    // Add event listener to update the toggle state
    this.checkbox = this.querySelector('input[type="checkbox"]') as HTMLInputElement;
    this.dot = this.querySelector('.dot') as HTMLElement;

    this.checkbox?.addEventListener('change', () => {
      if (!this.checkbox || !this.dot) return;
      if (this.checkbox.checked) {
        this.dot.classList.remove('translate-x-5', 'bg-blue-400');
      } else {
        this.dot.classList.add('translate-x-5', 'bg-blue-400');
      }

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this.checkbox!.checked },
        bubbles: true
      }));
    });
  }

  // Add getter and setter for checked state
  get checked() {
    return this.checkbox?.checked || false;
  }

  set checked(value) {
    if (this.checkbox && this.dot) {
      this.checkbox.checked = value;
      
      if (value) {
        this.dot.classList.add('translate-x-5', 'bg-blue-400');
      } else {
        this.dot.classList.remove('translate-x-5', 'bg-blue-400');
      }
    }
  }
}

// Register the custom element
customElements.define('toggle-switch', Toggle);

export { Toggle };