class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipContainer = null;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
      div {
        background-color: lightgray;
        border: 1px solid gray;
        border-radius: 2px;
        position: absolute;
        padding: 4px;
      }
      </style>
      <slot></slot>
      <span>(?)</span>
    `;
    this.mode = "icon";
    this.text = "Tooltip Text Here";
  }

  static get observedAttributes() {
    return ["text"];
  }

  connectedCallback() {
    if (this.hasAttribute("mode")) {
      this.mode = this.getAttribute("mode");
    }
    if (this.hasAttribute("text")) {
      this.text = this.getAttribute("text");
    }
    this._tooltipContainer = document.createElement("div");
    this._tooltipContainer.innerText = this.text;
    let iconContainer;
    if (this.mode === "icon") {
      iconContainer = this.shadowRoot.querySelector("span");
    } else {
      iconContainer = this.shadowRoot.querySelector("slot");
      this.shadowRoot.lastElementChild.remove();
    }
    iconContainer.addEventListener("mouseenter", this._showToolTip.bind(this));
    iconContainer.addEventListener("mouseleave", this._hideToolTip.bind(this));
  }

  _showToolTip() {
    this.shadowRoot.appendChild(this._tooltipContainer);
    setTimeout(this.changeAttribute.bind(this), 1000);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(document.querySelector("wc-tooltip").getAttribute("text"));
    if (name === "text") {
      this._tooltipContainer.innerText = newValue;
    }
  }

  changeAttribute() {
    console.log(
      document
        .querySelector("wc-tooltip")
        .setAttribute("text", "Updated Dynamically")
    );
  }

  _hideToolTip() {
    this.shadowRoot.removeChild(this._tooltipContainer);
  }
}

customElements.define("wc-tooltip", Tooltip);
