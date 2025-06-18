class Dropdown extends HTMLElement {
  select: HTMLSelectElement | null = null;
  connectedCallback() {
    const label = this.getAttribute('label') ?? "label_undefined";
    const placeholder = this.getAttribute('placeholder') ?? "Select an option";
    const value = this.getAttribute('value') ?? "";
    const name = this.getAttribute('name') ?? "";

    let options: string[] = [];
    const optionsStr = this.getAttribute('data-options');

    if (optionsStr) {
      try {
        options = optionsStr.split(",").map(s => s.trim());
      } catch (e) {
        console.error('Invalid options format for dropdown', e);
      }
    }

    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-2">
        <label>${label}</label>
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

  public subscribe(cb: (value: string | undefined) => void) {
    this.select?.addEventListener('change', () => {
      cb(this.value);
    });
  }

  public setDataOptions(optionsStr: string) {
    // Update the attribute
    this.setAttribute('data-options', optionsStr);

    if (!this.select) return;

    // Parse options
    let options: string[] = [];
    try {
      options = optionsStr.split(",").map(s => s.trim());
    } catch (e) {
      console.error('Invalid options format for dropdown', e);
      return;
    }

    // Save current value
    const currentValue = this.value;

    // Clear existing options (except the placeholder)
    while (this.select.options.length > 1) {
      this.select.remove(1);
    }

    // Add new options
    for (const opt of options) {
      const option = document.createElement('option');
      option.value = opt;
      option.text = opt;
      option.selected = opt === currentValue;
      this.select.add(option);
    }

    // If the current value is no longer in the options, select the placeholder
    if (currentValue && !options.includes(currentValue)) {
      this.select.value = "";
    }
  }
}

// Register the custom element
customElements.define('drop-down', Dropdown);

export { Dropdown };
