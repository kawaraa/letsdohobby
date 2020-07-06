"use strict";

(() => {
  const signupUrl = "http://localhost:8080/api/signup";
  const loginUrl = "http://localhost:8080/api/login";
  document.forms[1].addEventListener("submit", onSignup);
  const signupError = document.getElementById("signup-error");

  async function onSignup(e) {
    e.preventDefault();
    const {
      firstName,
      lastName,
      username,
      psw,
      pswConfirm,
      birthdayDay,
      birthdayMonth,
      birthdayYear,
    } = e.target;
    if (psw.value !== pswConfirm.value) {
      signupError.style.display = "block";
      signupError.innerHTML = "Passwords don't match";
    }
    const birthday = `${birthdayYear.value}-${birthdayMonth.value}-${birthdayDay.value}`;
    const userInfo = {
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      psw: psw.value,
      birthday,
    };
    try {
      await Http.post(signupUrl, userInfo);
      location.reload();
    } catch (error) {
      signupError.style.display = "block";
      signupError.innerHTML = error.message;
    }
  }

  document.forms[0].addEventListener("submit", onLogin);
  const loginError = document.getElementById("login-error");

  async function onLogin(e) {
    e.preventDefault();
    const { username, psw } = e.target;
    const userCredentials = {
      username: username.value,
      psw: psw.value,
    };
    try {
      await Http.post(loginUrl, userCredentials);
      location.reload();
    } catch (error) {
      loginError.innerHTML = error.message;
    }
  }
})();
