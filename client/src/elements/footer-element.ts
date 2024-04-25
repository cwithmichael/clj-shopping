import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("footer-element")
export class FooterElement extends LitElement {
  override render() {
    return html` <footer>&copy; Copyright 2024</footer> `;
  }

  static override styles = css`
    :host {
      display: flex;
      padding-top: 2em;
      justify-content: center;
      width: 100%;
    }
    footer {
      background-color: #50c878;
      color: white;
      text-align: center;
      padding: 1em;
      width: 100%;
    }
  `;
}
