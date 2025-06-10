/**
 * Accordion Web Component
 * 
 * A custom element that creates a collapsible accordion section.
 * Based on the details/summary HTML elements with enhanced styling and functionality.
 */
class Accordion extends HTMLElement {
  private _details: HTMLDetailsElement;
  private _summary: HTMLElement;
  private _content: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Create the internal structure
    this._details = document.createElement('details');
    this._summary = document.createElement('summary');
    this._content = document.createElement('div');
    
    // Set up the structure
    this._details.appendChild(this._summary);
    this._details.appendChild(this._content);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        margin-bottom: 0.5rem;
      }
      
      details {
        background-color: #374151;
        border-radius: 0.25rem;
        overflow: hidden;
      }
      
      summary {
        cursor: pointer;
        padding: 0.5rem 0.75rem;
        user-select: none;
        color: white;
        font-weight: 500;
      }
      
      summary:hover {
        background-color: #4B5563;
      }
      
      .content {
        padding: 0.25rem 1.5rem;
        color: white;
      }
    `;
    
    // Set classes
    this._content.className = 'content';
    
    // Add event listeners
    this._summary.addEventListener('click', (e) => {
      e.preventDefault();
      this._details.toggleAttribute('open');
      this.dispatchEvent(new CustomEvent('toggle', { 
        detail: { open: this._details.hasAttribute('open') }
      }));
    });
    
    // Append to shadow DOM
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._details);
  }
  
  connectedCallback() {
    // Set the summary text from the title attribute or slot
    if (this.hasAttribute('title')) {
      this._summary.textContent = this.getAttribute('title') || '';
    }
    
    // Move all children to the content div
    while (this.firstChild) {
      this._content.appendChild(this.firstChild);
    }
  }
  
  // Getters and setters for properties
  get open() {
    return this._details.hasAttribute('open');
  }
  
  set open(value) {
    if (value) {
      this._details.setAttribute('open', '');
    } else {
      this._details.removeAttribute('open');
    }
  }
  
  get title() {
    return this._summary.textContent || '';
  }
  
  set title(value) {
    this._summary.textContent = value;
  }
}

// Register the custom element
customElements.define('accordion-component', Accordion);

export default Accordion;