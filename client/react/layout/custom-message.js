import React from "react";

export default (props) => {
  let text = props.text;
  if (/error/gim.test(props.name)) {
    text = /\([!]+\)/i.test(text) ? text : "Something wrong happened, sorry for inconvenience(!)";
  }
  return (
    <p className={(props.name || "") + " no-line"} title="Error message" tabindex="0">
      {text}
    </p>
  );
};
