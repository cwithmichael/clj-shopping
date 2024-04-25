import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { buttonStyles } from "./button-styles";
import { Task } from "@lit/task";

@customElement("reset-button")
export class ResetButton extends LitElement {
  private _resetDataTask = new Task(this, {
    task: async ({ signal }: any) => {
      const response = await fetch(`http://localhost:3000/api/reset`, {
        method: "POST",
        signal,
      });
      if (!response.ok) {
        throw new Error(response.status.toString());
      }
    },
    autoRun: false,
    args: () => [],
  });

  private async _onClick() {
    await this._resetDataTask.run();
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("dataReset", options));
  }
  override render() {
    return html`<section>
      <button @click=${this._onClick} class="button">&#8635; Reset Data</button>
    </section>`;
  }
  static override styles = [
    buttonStyles,
    css`
      .button {
        color: white;
      }
      :host {
        display: flex;
        justify-content: center;
        padding-top: 1em;
      }
    `,
  ];
}
