import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./button-styles";

@customElement("info-element")
export class InfoElement extends LitElement {
  @property({ type: Boolean, reflect: true })
  active: boolean = false;

  override render() {
    return html`
      <section class="info">
        <p class="info-title">How it works?</p>
        <button class="button" @click="${() => (this.active = !this.active)}">
          ${this.active ? "Collapse" : "View More"}
        </button>
        <ol
          style="display: ${this.active ? "block" : "none"}"
          class="info-text"
        >
          <li>How the data is stored:</li>
          <ul>
            <li>
              The products data is stored in external json file. After first
              request this data is saved in a JSON data type in Redis like:
              <code
                >JSON.SET product:{productId} . JSON.SET product:{productId} .
                '{ "id": "productId", "name": "Product Name", "price": "375.00",
                "stock": 10 }'</code
              >.
            </li>
            <ul>
              <li>
                E.g
                <code
                  >JSON.SET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 . '{
                  "id": "e182115a-63d2-42ce-8fe0-5f696ecdfba6", "name":
                  "Brilliant Watch", "price": "250.00", "stock": 2 }'</code
                >
              </li>
            </ul>
            <li>
              The cart data is stored in a hash like:
              <code
                >HSET cart:{cartId} product:{productId} {productQuantity}</code
              >, where cartId is random generated value and stored in user
              session.
            </li>
            <ul>
              <li>
                E.g
                <code
                  >HSET cart:77f7fc881edc2f558e683a230eac217d
                  product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 1</code
                >
              </li>
            </ul>
          </ul>

          <li class="font-weight-bold mb-5">How the data is modified:</li>
          <ul>
            <li>
              The product data is modified like
              <code
                >JSON.SET product:{productId} . '{ "id": "productId", "name":
                "Product Name", "price": "375.00", "stock": {newStock} }'</code
              >.
            </li>
            <ul>
              <li>
                E.g
                <code
                  >JSON.SET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 . '{
                  "id": "e182115a-63d2-42ce-8fe0-5f696ecdfba6", "name":
                  "Brilliant Watch", "price": "250.00", "stock": 1 }</code
                >
              </li>
            </ul>
            <li>
              The cart data is modified like
              <code
                >HSET cart:{cartId} product:{productId}
                {newProductQuantity}</code
              >
              or
              <code
                >HINCRBY cart:{cartId} product:{productId} {incrementBy}</code
              >.
            </li>
            <ul>
              <li>
                E.g
                <code
                  >HSET cart:77f7fc881edc2f558e683a230eac217d
                  product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 2</code
                >
              </li>
              <li>
                E.g
                <code
                  >HINCRBY cart:77f7fc881edc2f558e683a230eac217d
                  product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 1</code
                >
              </li>
              <li>
                E.g
                <code
                  >HINCRBY cart:77f7fc881edc2f558e683a230eac217d
                  product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 -1</code
                >
              </li>
            </ul>
            <li>
              Product can be removed from cart like
              <code>HDEL cart:{cartId} product:{productId}</code>.
            </li>
            <ul>
              <li>
                E.g
                <code
                  >HDEL cart:77f7fc881edc2f558e683a230eac217d
                  product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code
                >
              </li>
            </ul>
            <li>
              Cart can be cleared using <code>HGETALL cart:{cartId}</code> and
              then <code>HDEL cart:{cartId} {productKey}</code> in loop.
            </li>
            <ul>
              <li>
                E.g
                <code>HGETALL cart:77f7fc881edc2f558e683a230eac217d</code> =>
                <code>product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>,
                <code>product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code>,
                <code>product:1f1321bb-0542-45d0-9601-2a3d007d5842</code> =>
                <code
                  >HDEL cart:77f7fc881edc2f558e683a230eac217d
                  product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code
                >,
                <code
                  >HDEL cart:77f7fc881edc2f558e683a230eac217d
                  product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code
                >,
                <code
                  >HDEL cart:77f7fc881edc2f558e683a230eac217d
                  product:1f1321bb-0542-45d0-9601-2a3d007d5842</code
                >
              </li>
            </ul>
            <li>
              All carts can be deleted when reset data is requested like:
              <code>SCAN {cursor} MATCH cart:*</code> and then
              <code>DEL cart:{cartId}</code> in loop.
            </li>
            <ul>
              <li>
                E.g <code>SCAN {cursor} MATCH cart:*</code> =>
                <code>cart:77f7fc881edc2f558e683a230eac217d</code>,
                <code>cart:217dedc2f558e683a230eac77f7fc881</code>,
                <code>cart:1ede77f558683a230eac7fc88217dc2f</code> =>
                <code>DEL cart:77f7fc881edc2f558e683a230eac217d</code>,
                <code>DEL cart:217dedc2f558e683a230eac77f7fc881</code>,
                <code>DEL cart:1ede77f558683a230eac7fc88217dc2f</code>
              </li>
            </ul>
          </ul>

          <li class="font-weight-bold">How the data is accessed:</li>
          <ul>
            <li>
              Products: <code>SCAN {cursor} MATCH product:*</code> to get all
              product keys and then <code>JSON.GET {productKey}</code> in loop.
            </li>
            <ul>
              <li>
                E.g <code>SCAN {cursor} MATCH product:*</code> =>
                <code>product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>,
                <code>product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code>,
                <code>product:1f1321bb-0542-45d0-9601-2a3d007d5842</code> =>
                <code
                  >JSON.GET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code
                >,
                <code>JSON.GET product:f9a6d214-1c38-47ab-a61c-c99a59438b1</code
                >,
                <code
                  >JSON.GET product:1f1321bb-0542-45d0-9601-2a3d007d5842</code
                >
              </li>
            </ul>
            <li>
              Cart: <code>HGETALL cart:{cartId}</code> to get quantity of
              products and <code>JSON.GET product:{productId}</code> to get
              products data in loop.
            </li>
            <ul>
              <li>
                E.g
                <code>HGETALL cart:77f7fc881edc2f558e683a230eac217d</code> =>
                <code
                  >product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 (quantity:
                  1)</code
                >,
                <code
                  >product:f9a6d214-1c38-47ab-a61c-c99a59438b12 (quantity:
                  0)</code
                >,
                <code
                  >product:1f1321bb-0542-45d0-9601-2a3d007d5842 (quantity:
                  2)</code
                >
                =>
                <code
                  >JSON.GET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code
                >,
                <code
                  >JSON.GET product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code
                >,
                <code
                  >JSON.GET product:1f1321bb-0542-45d0-9601-2a3d007d5842</code
                >
              </li>
            </ul>
          </ul>
        </ol>
      </section>
    `;
  }

  static override styles = [
    buttonStyles,
    css`
      .button {
        color: white;
      }
      .info-title {
        padding-left: 1em;
        color: white;
      }

      .info {
        display: flex;
        background-color: #50c878;
        padding: 0;
        color: white;
        text-align: left;
        width: 100%;
        border-radius: 5px;
        font-size: 1.25em;
        flex-flow: row wrap;
        justify-content: space-between;
      }

      ol {
        display: flex;
        flex-flow: row wrap;
        font-size: 0.5em;
        background-color: #ff8c00;
        width: 100%;
        border: none;
      }

      li {
        flex: 33%;
        text-align: left;
        padding: 1em;
      }

      .info-text {
        display: none;
        overflow: hidden;
        background-color: #f1f1f1;
        padding: 2.5em;
        font-size: 0.75em;
        color: black;
      }
    `,
  ];
}
