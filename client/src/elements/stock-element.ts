import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "../styles/button-styles";
import { Product } from "../types";
import { Task } from "@lit/task";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

@customElement("stock-element")
export class Stock extends LitElement {
  @property() product!: Product;
  @property() cartUpdated!: boolean;

  private _getProductTask = new Task(this, {
    task: async ([productId]) => {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      const product = (await response.json()) as {} as Product;
      return product;
    },
    args: () => [this.product.id, this.cartUpdated],
  });

  override render() {
    return html`
      ${this._getProductTask.render({
        pending: () => html`<p>Loading data...</p>`,
        complete: (product) => html`<div class="stock">
        <span class="stockQuantity">${
          product.stock > 0 ? `${product.stock} in stock` : "out of stock"
        }</span>
        <button data-product-id=${product.id} class="button" ?disabled=${
          product.stock < 1
        } @click=${this._onClick}>Add to Cart</button></span
      >
      </div>`,
        error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
      })}
    `;
  }
  private _onClick(_event: any) {
    const options = {
      detail: { productId: this.product.id, incrementBy: 1 },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("cartUpdateFromProduct", options));
  }

  static override styles = [
    buttonStyles,
    css`
      .button {
        color: white;
      }
      .stock {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding-bottom: 1em;
      }
      .stockQuantity {
        font-size: 1em;
      }
    `,
  ];
}
