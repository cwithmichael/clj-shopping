import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit/task";
import { cardStyles } from "../styles/card-styles";
import { buttonStyles } from "../styles/button-styles";
import "./product-element";
import { Product } from "../types";

@customElement("products-element")
export class ProductsElement extends LitElement {
  @property()
  cartUpdated!: boolean;
  @property()
  dataReset!: boolean;
  @property()
  productId?: string;

  private _productsTask = new Task(this, {
    task: async ([], { signal }: any) => {
      const response = await fetch(`http://localhost:3000/api/products`, {
        signal,
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      return (await response.json()) as {} as Product[];
    },
    args: () => [this.dataReset],
  });

  override render() {
    return this._productsTask.render({
      pending: () => html`<p>Loading products...</p>`,
      complete: (products: Product[]) => html`
        <ul>
          ${products.map(
            (product) =>
              html`<li>
                <product-element
                  .product=${product}
                  .cartUpdated=${this.cartUpdated}
                ></product-element>
              </li>`
          )}
        </ul>
      `,
      error: (e: any) => html`<p>Error: ${e}</p>`,
    });
  }

  static override styles = [
    buttonStyles,
    cardStyles,
    css`
      :host {
        display: flex;
      }

      .button {
        background-color: #e97451;
        color: white;
      }
      .button:hover {
        background-color: #ff8c00;
      }

      ul {
        list-style-type: none;
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        padding-left: 0;
        justify-content: space-between;
      }

      li {
        flex: 33%;
        max-width: 33%;
        max-height: 33%;
        text-align: center;
        padding-bottom: 1em;
        padding-right: 0.1em;
      }

      @media (max-width: 820px) {
        li {
          flex: 100%;
          max-width: 100%;
        }
      }
    `,
  ];
}
