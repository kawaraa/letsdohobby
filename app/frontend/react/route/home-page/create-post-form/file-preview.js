import React from "react";
import "./file-preview.css";

export default (props) => {
  const { type } = props.file;
  const fileUrl = (URL || webkitURL).createObjectURL(props.file);
  let element = <p className="uploaded-content error">Not supported file(!)</p>;

  if (/image/gim.test(props.file.type)) {
    element = <img src={fileUrl} className="uploaded-content" title="Uploaded item" tabindex="0" />;
  }
  if (/video/gim.test(props.file.type)) {
    element = (
      <video src={fileUrl} controls className="uploaded-content" title="Uploaded item" tabindex="0"></video>
    );
  }

  return (
    <div className="uploaded wrapper no-line" title="Uploaded item" tabindex="0">
      {element}

      <img
        src="/image/x-icon.svg"
        alt="Close uploaded item button"
        className="uploaded-item x-icon img"
        onClick={() => props.close(props.file.name)}
      />
    </div>
  );
};
