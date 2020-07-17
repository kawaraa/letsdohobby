import React from "react";
import "./exclamation-mark.css";

class ExclamationMark extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showOptions: false };
  }

  componentDidMount() {
    window.addEventListener("click", (e) => {
      const cssClass = e.target.className.baseVal || e.target.className;
      if (!/mark-btn/gim.test(cssClass)) this.setState({ showOptions: false });
    });
  }

  renderOptions() {
    const { listener, name } = this.props;
    const ccsClass = name + " mark-options item no-line";
    return (
      <ul className="exclamation-mark options">
        <li onClick={() => listener("retry")} className={ccsClass} tabindex="0">
          Retry
        </li>
        <li onClick={() => listener("cancel")} className={ccsClass} tabindex="0">
          Cancel
        </li>
      </ul>
    );
  }
  render() {
    const { listener, name } = this.props;

    return (
      <div className={name + " exclamation-mark wrapper"}>
        {listener ? (
          <button
            type="button"
            onClick={() => this.setState({ showOptions: !this.state.showOptions })}
            className="mark-btn no-line"
            title="Exclamation mark"
          >
            !
          </button>
        ) : (
          <span className="mark-btn no-line" title="Exclamation mark" tabindex="0">
            !
          </span>
        )}
        {this.state.showOptions && this.renderOptions()}
      </div>
    );
  }
}
export default ExclamationMark;
