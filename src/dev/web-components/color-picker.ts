class ColorPicker extends HTMLElement {
  private colorInput: HTMLInputElement | null = null;
  private hueInput: HTMLInputElement | null = null;
  private saturationInput: HTMLInputElement | null = null;
  private lightnessInput: HTMLInputElement | null = null;

  connectedCallback() {
    // Get attributes
    const label = this.getAttribute('label') ?? "Color";
    const value = this.getAttribute('value') ?? "#ff0000";
    
    // Convert hex to HSL for initial values
    const { h, s, l } = this.hexToHSL(value);
    
    // Reconstruct HTML structure
    this.innerHTML = `
      <div class="mb-4">
        <label class="block text-gray-400 text-xs mb-1">${label}</label>
        <input 
          type="color" 
          class="w-full h-8 bg-gray-600 text-white rounded cursor-pointer"
          value="${value}"
        >
        <div class="mt-3">
          <div class="flex space-x-2">
            <div class="flex-1">
              <label class="block text-gray-400 text-xs mb-1">H</label>
              <input 
                type="number" 
                class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       appearance-none"
                min="0"
                max="360"
                step="1"
                value="${Math.round(h)}"
              >
            </div>
            <div class="flex-1">
              <label class="block text-gray-400 text-xs mb-1">S</label>
              <input 
                type="number" 
                class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       appearance-none"
                min="0"
                max="100"
                step="1"
                value="${Math.round(s)}"
              >
            </div>
            <div class="flex-1">
              <label class="block text-gray-400 text-xs mb-1">L</label>
              <input 
                type="number" 
                class="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       appearance-none"
                min="0"
                max="100"
                step="1"
                value="${Math.round(l)}"
              >
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Store references to elements
    this.colorInput = this.querySelector('input[type="color"]') as HTMLInputElement;
    
    const inputs = this.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;
    this.hueInput = inputs[0];
    this.saturationInput = inputs[1];
    this.lightnessInput = inputs[2];
    
    // Add event listeners
    this.colorInput?.addEventListener('input', () => {
      this.updateFromHex(this.colorInput?.value || '#ff0000');
      this.dispatchChangeEvent();
    });
    
    this.hueInput?.addEventListener('input', () => {
      this.updateFromHSL();
      this.dispatchChangeEvent();
    });
    
    this.saturationInput?.addEventListener('input', () => {
      this.updateFromHSL();
      this.dispatchChangeEvent();
    });
    
    this.lightnessInput?.addEventListener('input', () => {
      this.updateFromHSL();
      this.dispatchChangeEvent();
    });
  }
  
  // Update color display and hex input from HSL values
  updateFromHSL() {
    const h = this.hue;
    const s = this.saturation;
    const l = this.lightness;
    
    const hexColor = this.hslToHex(h, s, l);
    
    if (this.colorInput) {
      this.colorInput.value = hexColor;
    }
  }
  
  // Update HSL inputs from hex value
  updateFromHex(hexColor: string) {
    const { h, s, l } = this.hexToHSL(hexColor);
    
    if (this.hueInput) {
      this.hueInput.value = Math.round(h).toString();
    }
    
    if (this.saturationInput) {
      this.saturationInput.value = Math.round(s).toString();
    }
    
    if (this.lightnessInput) {
      this.lightnessInput.value = Math.round(l).toString();
    }
  }
  
  // Dispatch custom change event
  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { 
        color: this.value,
        hsl: {
          h: this.hue,
          s: this.saturation,
          l: this.lightness
        }
      },
      bubbles: true
    }));
  }
  
  // Convert hex color to HSL
  hexToHSL(hex: string): { h: number, s: number, l: number } {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return { 
      h: h * 360, 
      s: s * 100, 
      l: l * 100 
    };
  }
  
  // Convert HSL to hex color
  hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  // Getters and setters
  get value(): string {
    return this.colorInput?.value || '#ff0000';
  }
  
  set value(newValue: string) {
    if (this.colorInput) {
      this.colorInput.value = newValue;
      this.updateFromHex(newValue);
    }
  }
  
  get hue(): number {
    return this.hueInput ? parseFloat(this.hueInput.value) : 0;
  }
  
  set hue(newValue: number) {
    if (this.hueInput) {
      this.hueInput.value = newValue.toString();
      this.updateFromHSL();
    }
  }
  
  get saturation(): number {
    return this.saturationInput ? parseFloat(this.saturationInput.value) : 0;
  }
  
  set saturation(newValue: number) {
    if (this.saturationInput) {
      this.saturationInput.value = newValue.toString();
      this.updateFromHSL();
    }
  }
  
  get lightness(): number {
    return this.lightnessInput ? parseFloat(this.lightnessInput.value) : 0;
  }
  
  set lightness(newValue: number) {
    if (this.lightnessInput) {
      this.lightnessInput.value = newValue.toString();
      this.updateFromHSL();
    }
  }
}

// Register the custom element
customElements.define('color-picker', ColorPicker);

export { ColorPicker };