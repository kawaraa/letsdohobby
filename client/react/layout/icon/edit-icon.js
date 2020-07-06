import React from "react";
import "./edit-icon.css";

export default (props) => {
  const name = props.name || "";

  return (
    <div className={name + " edit-icon-wrapper"}>
      <div className={name + " edit-icon-inner"}>
        <svg viewBox="0 0 400 400" className={name + " edit-svg"}>
          <g className={name + " edit-svg layer stroke"} stroke-linejoin="round">
            <title>Edit</title>
            <path d="m376.46422,39.41346l-62.7497,-26.88095c-15.83577,-6.77395 -36.69672,-3.51337 -46.6729,7.27945l-24.73643,26.83041l120.04777,51.38598l24.755,-26.81775c9.93909,-10.80545 5.19204,-25.03581 -10.64373,-31.79711l0,-0.00003zm-347.77515,239.03447l120.04777,51.38598l195.66637,-212.29251l-120.10343,-51.3986l-195.61075,212.30517l0.00004,-0.00003zm-18.33907,65.28774l-2.65165,48.26438l62.65702,-22.58404l58.2252,-20.95375l-115.81996,-49.60401l-2.41058,44.8774l-0.00004,0.00003z" />
          </g>
        </svg>
      </div>
      <button
        onClick={props.onClick || null}
        type="button"
        className={name + " edit-icon no-line"}
        title={name + " Edit button"}
      ></button>
    </div>
  );
};
