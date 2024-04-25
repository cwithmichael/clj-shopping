import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "./card-styles";
import { CartItem } from "./types";

@customElement("cart-item-element")
export class CartItemElement extends LitElement {
  @property()
  item!: CartItem;

  private _updateCart(value: number) {
    const options = {
      detail: { productId: this.item.product.id, incrementBy: value },
      bubbles: true,
      composed: true,
    };
    if (this.item.cart_quantity + value === 0) {
      this.dispatchEvent(new CustomEvent("cartRemove", options));
      return;
    }

    this.dispatchEvent(new CustomEvent("cartUpdate", options));
  }

  override render() {
    return html`
      <div class="card cartItem">
        <img
          src="assets/products/${this.item.product.id}.jpg"
          alt="${this.item.product.name}"
        />
        <span class="name">${this.item.product.name}</span>
        <div class="buttons">
          <button class="button" @click=${() => this._updateCart(-1)}>
            &#8249;
          </button>
          <span class="quantity">${this.item.cart_quantity}</span>
          <button
            class="button"
            @click=${() => this._updateCart(1)}
            ?disabled=${this.item.product.stock === 0}
          >
            &#8250;
          </button>
        </div>
        <span class="price">$${this.item.product.price}</span>
      </div>
    `;
  }

  static override styles = [
    cardStyles,
    css`
      :host {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
      }
      .card {
        background-color: #ff8c00;
        display: flex;
        flex-flow: row wrap;
        width: 90%;
      }

      .cartItem {
        display: flex;
        background-color: white;
        color: black;
        flex-flow: row wrap;
        justify-content: space-evenly;
        align-items: center;
        padding-left: 1em;
        padding-right: 1em;
      }
      .buttons {
        display: flex;
        justify-content: space-evenly;
        padding-right: 2em;
        width: 25%;
      }
      .button {
        background-color: black;
        color: white;
        padding-left: 0.5em;
      }
      .button:hover {
        background-color: orange;
        color: white;
        cursor: pointer;
      }

      .button:disabled {
        background-color: lightgray;
        color: white;
        cursor: not-allowed;
      }

      .price {
        color: green;
        padding-left: 2em;
        width: 25%;
      }
      .name {
        width: 25%;
        font-size: 1em;
      }
      .quantity {
        padding-left: 0.5em;
        padding-right: 0.5em;
      }
      img {
        width: 10%;
      }

      @media (max-width: 1024px) {
        img {
          width: 50px;
          padding-right: 1em;
        }
        .buttons {
          padding-right: 1em;
        }
        .price {
          width: 25%;
          padding-left: 0;
          padding-right: 8%;
        }

        .cartItem {
          padding: 0;
          justify-content: space-evenly;
        }
      }
    `,
  ];
}
