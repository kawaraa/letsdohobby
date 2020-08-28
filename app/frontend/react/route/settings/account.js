import React from "react";
import { getConfig } from "../../config/config";
import Request from "../../utility/request";
import { UsernameField, PswField } from "./account-fields";
import EditUsername from "./edit-username";
import EditPSW from "./edit-psw";
import LoadingScreen from "../../layout/icon/loading-screen";
import CustomMessage from "../../layout/custom-message";
import "./account.css";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.updateState = this.handleUpdateState.bind(this);
    this.onDeleteAccount = this.HandleDeleteAccount.bind(this);
    this.config = getConfig("deleteAccount");
    this.state = {
      loading: false,
      error: "",
      editField: "",
    };
  }

  handleUpdateState(data) {
    this.setState(data);
  }
  async HandleDeleteAccount() {
    try {
      const psw = prompt("Please enter password to confirm deletion");
      if (psw === null) return;
      if (!psw.trim() || psw.length < 10) throw new Error("Invalid input Password");
      if (!window.confirm(this.config.confirmMessage)) return;
      this.setState({ loading: true });
      await Request.send({ psw }, this.config.url);
      window.user = null;
      window.dispatchEvent(new CustomEvent("UPDATE_APP", { detail: { user: null } }));
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }
  async componentWillMount() {}

  render() {
    const { loading, error, editField } = this.state;
    if (loading) return <LoadingScreen />;

    const props = { changeMode: this.updateState };
    const editUsername = editField === "username";
    const editPsw = editField === "psw";

    return (
      <div className="settings wrapper account">
        <h1 className="account title">Account</h1>
        {editUsername ? <EditUsername {...props} /> : <UsernameField {...props} />}
        {editPsw ? <EditPSW {...props} /> : <PswField {...props} />}
        {error && <CustomMessage text={error} name="error" />}
        <button type="button" onClick={this.onDeleteAccount} className="btn delete_account">
          Delete Account
        </button>
      </div>
    );
  }
}

export default Account;
