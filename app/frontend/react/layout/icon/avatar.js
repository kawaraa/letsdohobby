import React from "react";
import "./avatar.css";

export default (props) => {
  const name = props.name || "";

  return (
    <div className={name + " avatar-wrapper"}>
      <div className={name + " avatar-inner"}>
        {props.src && props.src.length > 10 ? (
          <img src={props.src} alt="Avatar" className="avatar img" />
        ) : (
          <svg viewBox="0 0 400 400" className="avatar svg">
            <title>{name + " Avatar"}</title>
            <path
              d="m199.88096,10c-73.18293,0 -132.91667,54.51448 -132.91667,121.30305c0,41.46943 23.17274,78.28907 58.15104,100.18332c-67.91941,26.36907 -115.11534,88.00762 -115.11534,159.75179l37.9762,0c0,-77.40292 67.09126,-138.63206 151.90476,-138.63206c84.81348,0 151.90474,61.22916 151.90474,138.63206l37.9762,0c0,-71.74416 -47.19593,-133.38272 -115.11531,-159.75179c34.97828,-21.89426 58.15104,-58.7139 58.15104,-100.18332c0,-66.78857 -59.73374,-121.30305 -132.91667,-121.30305zm0,34.65802c52.65906,0 94.94047,38.58705 94.94047,86.64503c0,48.05799 -42.2814,86.64503 -94.94047,86.64503c-52.65908,0 -94.9405,-38.58705 -94.9405,-86.64503c0,-48.05799 42.2814,-86.64503 94.9405,-86.64503z"
              className={"avatar svg stroke"}
            />
          </svg>
        )}
      </div>

      <button type="button" title={name + " avatar"} className={name + " avatar-icon no-line"}></button>
    </div>
  );
};