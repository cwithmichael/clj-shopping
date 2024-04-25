import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./info-element";
import "./products-element";
import "./cart-element";
import "./header-element";
import "./reset-button";
import "./footer-element";
import { Task } from "@lit/task";

const API_URL = process.env.API_URL || "http://localhost:3000";

@customElement("app-element")
export class App extends LitElement {
  @property()
  dataReset!: boolean;
  @property()
  cartUpdated!: boolean;

  private _dataResetListener(_e: CustomEvent) {
    this.dataReset = !this.dataReset;
  }

  private _cartListener(e: CustomEvent) {
    this._updateCartTask.run([e.detail.productId, e.detail.incrementBy]);
  }

  private _deleteFromCartListener(e: CustomEvent) {
    this._deleteFromCartTask.run([e.detail.productId]);
  }

  private _clearCartListener(_e: CustomEvent) {
    this._clearCartTask.run([]);
  }

  private _checkoutListener(_e: CustomEvent) {
    console.log("Checkout clicked");
  }

  private _clearCartTask = new Task(this, {
    task: async ({ signal }: any) => {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        credentials: "include",
        signal,
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      this.cartUpdated = !this.cartUpdated;
    },
    autoRun: false,
  });

  private _deleteFromCartTask = new Task(this, {
    task: async ([productId], { signal }: any) => {
      const response = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
        signal,
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      this.cartUpdated = !this.cartUpdated;
    },
    autoRun: false,
  });

  private _updateCartTask = new Task(this, {
    task: async ([productId, incrementBy], { signal }: any) => {
      const response = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          "increment-by": incrementBy ?? 1,
        }),
        signal,
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
      this.cartUpdated = !this.cartUpdated;
    },
    autoRun: false,
  });

  override render() {
    return html`
      <div @dataReset=${this._dataResetListener} class="row">
        <div class="main-column">
          <header-element></header-element>
          <info-element></info-element>
          <products-element
            @cartUpdateFromProduct=${this._cartListener}
            .dataReset=${this.dataReset}
            .cartUpdated=${this.cartUpdated}
          ></products-element>
        </div>
        <div class="aside-column cart-container">
          <cart-element
            @cartRemove=${this._deleteFromCartListener}
            @cartUpdate=${this._cartListener}
            @cartClear=${this._clearCartListener}
            @checkout=${this._checkoutListener}
            .dataReset=${this.dataReset}
            .cartUpdated=${this.cartUpdated}
          ></cart-element>
          <reset-button></reset-button>
        </div>
      </div>
      <div class="row">
        <footer-element></footer-element>
      </div>
    `;
  }

  static override styles = css`
    .row {
      display: flex;
      align-items: center;
    }

    .main-column {
      flex: 60%;
      max-width: 60%;
      padding-left: 2em;
    }

    .aside-column {
      flex: 40%;
      max-width: 40%;
      padding-left: 2em;
    }

    button {
      background: #ff8c00;
      border: 1px solid black;
      border-radius: 5px;
      text-align: center;
    }

    .cart-container {
      padding-bottom: 32em;
    }

    @media (max-width: 800px) {
      .cart-container {
        flex: 50%;
        max-width: 50%;
        padding-bottom: 0;
      }
    }

    @media (max-width: 600px) {
      .main-column {
        flex: 100%;
        max-width: 100%;
        justify-content: center;
        padding-left: 0;
      }
      .cart-container {
        flex: 100%;
        max-width: 100%;
        text-align: center;
        padding-left: 0;
        padding-top: 0;
      }
      body {
        background-image: none;
      }
    }

    @media screen and (max-width: 620px) {
      .row {
        flex-direction: column;
      }
    }
  `;
}
