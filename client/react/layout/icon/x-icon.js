import React from "react";
import "./x-icon.css";

export default (props) => {
  const name = props.name || "";

  return (
    <div className={name + " x-icon-wrapper"}>
      <div className={name + " x-icon-inner"}>
        <svg viewBox="0 0 400 400" className={name + " x svg"} stroke-linecap="round">
          <g className={name + " x svg-layer"}>
            <line x1="5.75001" x2="393.75001" y1="5.50001" y2="394.5" />
            <line x1="394.75" x2="5.75" y1="5.49999" y2="394.49999" />
          </g>
        </svg>
      </div>
      <button
        onClick={props.onClick || null}
        type="button"
        className={name + " x-icon no-line"}
        title={name + " Close button"}
      ></button>
    </div>
  );
};
