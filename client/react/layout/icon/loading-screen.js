import React from "react";

export default (props) => {
  // const listener = props.onClick || null;
  const text = props.text || "";

  return (
    <div id="loading-screen-wrapper">
      <svg viewBox="0 0 100 100" id="loading-screen-svg">
        <rect x="25.6405" y="55" width="30" height="30" rx="3" ry="3" id="rect-1">
          <animate
            attributeName="x"
            dur="2s"
            repeatCount="indefinite"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            values="15;55;55;55;55;15;15;15;15"
            begin="-1.8333333333333333s"
          ></animate>
          <animate
            attributeName="y"
            dur="2s"
            repeatCount="indefinite"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            values="15;55;55;55;55;15;15;15;15"
            begin="-1.3333333333333333s"
          ></animate>
        </rect>
        <rect x="55" y="15" width="30" height="30" rx="3" ry="3" id="rect-2">
          <animate
            attributeName="x"
            dur="2s"
            repeatCount="indefinite"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            values="15;55;55;55;55;15;15;15;15"
            begin="-1.1666666666666667s"
          ></animate>
          <animate
            attributeName="y"
            dur="2s"
            repeatCount="indefinite"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            values="15;55;55;55;55;15;15;15;15"
            begin="-0.6666666666666666s"
          ></animate>
        </rect>
        <rect x="15" y="15" width="30" height="30" rx="3" ry="3" id="rect-3">
          <animate
            attributeName="x"
            dur="2s"
            repeatCount="indefinite"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            values="15;55;55;55;55;15;15;15;15"
            begin="-0.5s"
          ></animate>
          <animate
            attributeName="y"
            dur="2s"
            repeatCount="indefinite"
            keyTimes="0;0.083;0.25;0.333;0.5;0.583;0.75;0.833;1"
            values="15;55;55;55;55;15;15;15;15"
            begin="0s"
          ></animate>
        </rect>
      </svg>
      {text && <div id="loading-screen-text"> {text + "..."}</div>}

      {/* <div onClick={listener} id="loading-screen-button"></div> */}
    </div>
  );
};
