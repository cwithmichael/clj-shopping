import { css } from "lit";

export const cardStyles = css`
  .card {
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    border-radius: 5px; /* 5px rounded corners */
  }
  /* Add rounded corners to the top left and the top right corner of the image */
  img {
    border-radius: 5px 5px 0 0;
    max-width: 33%;
  }

  /* On mouse-over, add a deeper shadow */
  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;
