import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import { svg } from "lit";
export const cart = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>`;

@customElement("header-element")
export class HeaderElement extends LitElement {
  override render() {
    return html`
      <div>
        <section>
          <img src="clojure.svg" />
          <span class="text">Clojure Cart Demo</span>
        </section>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: flex;
      justify-content: space-around;
    }
    div {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
    }
    p {
      color: black;
    }
    img {
      width: 2em;
      height: 1.6em;
      vertical-align: -0.125em;
    }
    .text {
      text-align: center;
      font-size: 2em;
    }

    svg {
      width: 1em;
      height: 1em;
      vertical-align: -0.125em;
    }

    section {
      padding-top: 1em;
      padding-bottom: 1em;
      color: green;
      font-size: 2em;
      font-weight: 800;
      font-style: bold;
      width: 100%;
    }

    @media (max-width: 1024px) {
      section {
        font-size: 2em;
      }
      div {
        justify-content: center;
      }
      img {
        display: none;
      }
    }

    @media (max-width: 414px) {
      section {
        font-size: 1.5em;
      }
    }
  `;
}
