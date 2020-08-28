import React from "react";
import "./file-preview.css";

export default ({ remove, file }) => {
  const { type } = file;
  const fileUrl = (URL || webkitURL).createObjectURL(file);
  let element = <p className="uploaded-content error">Not supported file(!)</p>;

  if (/image/gim.test(file.type)) {
    element = <img src={fileUrl} className="uploaded-content" title="Uploaded item" tabindex="0" />;
  }
  if (/video/gim.test(file.type)) {
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
        onClick={() => remove(file.name)}
      />
    </div>
  );
};
