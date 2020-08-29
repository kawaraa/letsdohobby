import React, { useContext } from "react";
import { getConfig } from "../../config/config";
import { AppContext } from "../../store/app-store";
import { UsernameField, PswField } from "./account-fields";
import EditUsername from "./edit-username";
import EditPSW from "./edit-psw";
import "./account.css";

const Account = (props) => {
  const config = getConfig("deleteAccount");
  const { Request, user, setUser, updateProgress, editingField, setEditingField } = useContext(AppContext);

  const HandleDeleteAccount = async () => {
    try {
      const psw = prompt("Please enter password to confirm deletion");
      if (psw === null) return;
      if (!psw.trim() || psw.length < 10) throw new Error("Invalid input Password(!)");
      if (!window.confirm(config.confirmMessage)) return;
      updateProgress({ loading: true });
      await Request.send({ psw }, config.url);
      setUser(null);
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  return (
    <div className="settings wrapper account">
      <h1 className="account title">Account</h1>
      {editingField === "username" ? <EditUsername /> : <UsernameField {...{ setEditingField, user }} />}
      {editingField === "psw" ? <EditPSW /> : <PswField setEditingField={setEditingField} />}

      <button type="button" onClick={HandleDeleteAccount} className="btn delete_account">
        Delete Account
      </button>
    </div>
  );
};

export default Account;
