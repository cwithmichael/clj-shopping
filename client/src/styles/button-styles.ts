import { css } from "lit";

export const buttonStyles = css`
  .button {
    background: #50c878;
    border: 1px solid black;
    font-size: 1em;
    border-radius: 5px;
    color: black;
    align-self: center;
    margin-right: 1em;
    font-family: "Oswald", sans-serif;
  }
  button:hover {
    background-color: black;
    color: white;
    cursor: pointer;
  }
  button:disabled,
  button[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    pointer-events: none;
  }
`;
