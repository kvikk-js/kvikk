import { LitElement, html, css } from "lit";

export default class WarpCard extends LitElement {
    static styles = [
        css`
            header, footer, section {
                padding: 8px;
            }

            header {
                background-color: var(--w-header-background-color, #999);
            }
            footer {
                background-color: #999;
            }
        `,
    ];

    constructor() {
        super();
    }

    firstUpdated(){
        const slot = this.shadowRoot.querySelector("#slot");
        this.slt = slot.assignedNodes();
        if (this.slt.length===0){
          console.log('No content is available')
        } else {
          console.log('Content available', this.slt)
        }
    }

    render() {
        return html`
            <div class="box">
                <header part="header">
                    <slot id="slot" name="header"></slot>
                </header>
                <section><slot></slot></section>
                <footer part="footer">
                    <slot name="footer"></slot>
                </footer>
            </div>
        `;
    }
}

if (!customElements.get('w-card')) {
    customElements.define('w-card', WarpCard);
}