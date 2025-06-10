class Dropdown extends HTMLElement {
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
                 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 appearance-none"
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
    const select = this.querySelector('select');
    select?.addEventListener('change', (e) => {
      if (e.target instanceof HTMLSelectElement) {
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('change', {
          detail: { value: e.target.value },
          bubbles: true
        }));
      }
    });
  }

  // Add getter and setter for value
  get value() {
    const select = this.querySelector('select') as HTMLSelectElement;
    return select?.value || '';
  }

  set value(newValue) {
    const select = this.querySelector('select') as HTMLSelectElement;
    if (select) {
      select.value = newValue;
    }
  }
}

// Register the custom element
customElements.define('drop-down', Dropdown);

export { Dropdown };