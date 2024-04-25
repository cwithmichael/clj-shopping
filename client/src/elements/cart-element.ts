import { LitElement, html, css, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "../styles/card-styles";
import { buttonStyles } from "../styles/button-styles";
import { CartItem } from "../types";
import { Task } from "@lit/task";
import "./cart-item-element";

const API_URL = process.env.API_URL || "http://localhost:3000";

const cart = svg`<svg class="cartIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>`;
@customElement("cart-element")
export class CartElement extends LitElement {
  @property()
  dataReset?: boolean;
  @property()
  cartUpdated?: boolean;

  private _getCartTask = new Task(this, {
    task: async ([], { signal }: any) => {
      const response = await fetch(`${API_URL}/api/cart`, {
        credentials: "include",
        signal,
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      const results = (await response.json()) as {} as CartItem[];
      return results;
    },
    args: () => [this.dataReset, this.cartUpdated],
  });

  override render() {
    return html`
      ${this._getCartTask.render({
        pending: () => html`<div class="card"><p>Loading data...</p></div>`,
        complete: (items: CartItem[]) =>
          items.length > 0
            ? html` <section class="card cart">
                <span class="cart-title">${cart} Shopping Cart</span>
                <ul>
                  ${items.map(
                    (item) =>
                      html`<li>
                        <cart-item-element .item=${item}></cart-item-element>
                      </li>`
                  )}
                </ul>
                <p class="total">
                  Total:
                  ${
                    items.length > 0
                      ? items
                          .reduce(
                            (acc, { cart_quantity, product: { price } }) =>
                              acc + Number(price) * cart_quantity,
                            0.0
                          )
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                      : 0
                  }
                </p>
                <div class="buttons">
                  <button class="button" @click=${this._clearCart}>
                    Clear Cart
                  </button>
                  <button class="button" @click=${this._checkout}>
                    Checkout
                  </button>
              </section>`
            : html`
                <section class="card cart">
                  <span class="cart-title">${cart} Shopping Cart</span>
                  <p>Cart is Empty. Please add items.</p>
                  <div class="buttons">
                    <button class="button" disabled>Clear Cart</button>
                    <button class="button" disabled>Checkout</button>
                  </div>
                </section>
              `,
        error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
      })}
    `;
  }

  private _clearCart() {
    const options = {
      detail: {},
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("cartClear", options));
  }

  private _checkout() {
    const options = {
      detail: {},
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("checkout", options));
  }

  static override styles = [
    buttonStyles,
    cardStyles,
    css`
      :host {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
      .cartIcon {
        width: 1em;
        height: 1em;
        vertical-align: -0.125em;
      }
      .cart-title {
        color: black;
        font-size: 1.5em;
        padding: 1em;
      }
      .card {
        background-color: #50c878;
        display: flex;
        flex-flow: column wrap;
        padding-right: 10em;
      }
      .cart {
        width: 90%;
        text-align: left;
        justify-content: space-between;
        align-items: center;
        color: white;
        padding: 1em;
      }

      .button {
        color: white;
      }

      .buttons {
        display: flex;
        width: 100%;
        justify-content: space-around;
      }

      ul {
        list-style-type: none;
        display: flex;
        flex-flow: column wrap;
        width: 100%;
        padding-left: 0;
        justify-content: space-between;
        align-items: stretch;
      }

      li {
        padding: 0.5em;
      }

      .total {
        color: black;
        font-size: 1.5em;
      }

      @max-width: 800px {
        .card {
          flex-flow: row wrap;
          justify-content: space-between;
        }
      }
    `,
  ];
}
