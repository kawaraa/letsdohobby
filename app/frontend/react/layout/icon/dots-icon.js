import React from "react";
import "./dots-icon.css";

export default (props) => {
  const name = props.name || "";

  return (
    <div className={name + " dots-icon-wrapper"}>
      <div className={name + " dots-icon-inner"}>
        <span className={name + " dots-icon circle"}></span>
        <span className={name + " dots-icon circle"}></span>
        <span className={name + " dots-icon circle"}></span>
      </div>
      <button
        onClick={props.onClick || null}
        type="button"
        className={name + " dots-icon no-line"}
        title={name + " Options button"}
      ></button>
    </div>
  );
};
