import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "./card-styles";
import { buttonStyles } from "./button-styles";
import "./stock-element";
import { Product } from "./types";

@customElement("product-element")
export class ProductElement extends LitElement {
  @property()
  product!: Product;
  @property()
  cartUpdated!: boolean;

  override render() {
    return html` <div class="card">
      <img
        src="assets/products/${this.product.id}.jpg"
        alt="${this.product.name}"
      />
      <p class="name">${this.product.name}</p>
      <p class="price">$${this.product.price}</p>
      <stock-element
        .product=${this.product}
        .cartUpdated=${this.cartUpdated}
      ></stock-element>
    </div>`;
  }

  static override styles = [
    buttonStyles,
    cardStyles,
    css`
      .button {
        background-color: #e97451;
        color: white;
      }
      .button:hover {
        background-color: #ff8c00;
      }
      .name {
        font-size: 1.25em;
      }

      img {
        width: 100%;
        height: 100px;
      }

      .stock {
        display: flex;
        justify-content: space-around;
        font-size: 1em;
        padding-bottom: 1em;
      }
      .price {
        border-bottom: 1px solid silver;
        padding-bottom: 2em;
        color: green;
      }

      @media (max-width: 1024px) {
        .name {
          font-size: 1em;
        }
      }
    `,
  ];
}
