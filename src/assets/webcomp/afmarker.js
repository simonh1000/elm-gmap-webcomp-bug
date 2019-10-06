"use strict";

{
    customElements.define(
        "af-marker",
        class extends HTMLElement {
            static get observedAttributes() {
                return ["latitude", "longitude"];
            }

            constructor() {
                super();

                this.latitude = null;
                this.longitude = null;
            }

            connectedCallback() {}

            attributeChangedCallback(name, oldVal, val) {
                switch (name) {
                    case "latitude":
                    case "longitude":
                        this[name] = parseFloat(val);
                        break;
                    default:
                        console.error(name);
                        break;
                }
            }
        }
    );
}