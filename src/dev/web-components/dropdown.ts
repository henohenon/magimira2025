class Dropdown extends HTMLElement {
  select: HTMLSelectElement | null = null;
  connectedCallback() {
    const label = this.getAttribute('label') ?? "label_undefined";
    const placeholder = this.getAttribute('placeholder') ?? "Select an option";
    const value = this.getAttribute('value') ?? "";
    const name = this.getAttribute('name') ?? "";
    
    let options: string[] = [];
    const optionsAttr = this.getAttribute('data-options');
    
    if (optionsAttr) {
      try {
        options = JSON.parse(optionsAttr);
      } catch (e) {
        console.error('Invalid options format for dropdown', e);
      }
    }

    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-2">
        <label class="block text-gray-400 text-xs mb-1">${label}</label>
        <select 
          class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 "
          name="${name}"
        >
          <option value="" ${!value ? 'selected' : ''} disabled>${placeholder}</option>
          ${options.map(opt => 
            `<option value="${opt}" ${opt === value ? 'selected' : ''}>${opt}</option>`
          ).join('')}
        </select>
      </div>
    `;

    // Add event listener for change events
    this.select = this.querySelector('select');
  }

  // Add getter and setter for value
  get value(): string | undefined {
    if (!this.select) return undefined;
    return this.select.value;
  }

  set value(newValue: string) {
    if (!this.select) return;
    this.select.value = newValue;
  }
}

// Register the custom element
customElements.define('drop-down', Dropdown);

export { Dropdown };