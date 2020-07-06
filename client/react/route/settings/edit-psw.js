import React from "react";
import { config } from "../../config/config";
import Request from "../../utility/request";
import XIcon from "../../layout/icon/x-icon";

class EditPSW extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.handleSubmit.bind(this);
    this.config = config("updatePsw");
    this.state = { loading: false, error: "" };
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { psw, newPsw, confirmNewPsw } = e.target;
    try {
      if (newPsw.value !== confirmNewPsw.value) throw new Error("Password doesn't match");
      this.setState({ loading: true });
      await Request.send({ psw: psw.value, newPsw: newPsw.value }, this.config.url);
      this.handleCancel();
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  render() {
    const { loading, error } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="account psw edit-form">
        <XIcon onClick={() => this.props.changeMode({ editField: "" })} name="account" />
        <input type="password" name="psw" placeholder="Password" required className="f no-line" />
        <input type="password" name="newPsw" placeholder="Password" required className="no-line" />
        <input
          type="password"
          name="confirmNewPsw"
          placeholder="Confirm Password"
          required
          className="l no-line"
        />
        <button type="submit" className="no-line">
          {loading && <LoadingIcon />}
          Save
        </button>
        {error && <CustomMessage text={error} name="error" />}
      </form>
    );
  }
}

export default EditPSW;
