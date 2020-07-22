import React from "react";

export default (props) => {
  let text = props.text,
    listener = props.listener || null;
  if (/error/gim.test(props.name)) {
    text = /\([!]+\)/i.test(text) ? text : "Something wrong happened, sorry for inconvenience(!)";
  }
  return (
    <p className={(props.name || "") + " no-line"} title="Error message" tabindex="0">
      {text}
      {listener && (
        <span onClick={listener} className={(props.name || "") + " error-x"}>
          X
        </span>
      )}
    </p>
  );
};
