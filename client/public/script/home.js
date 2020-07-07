"use strict";

const loadingScreen = document.getElementById("loading-screen-wrapper");
const signupError = document.getElementById("signup-error");
const loginError = document.getElementById("login-error");

(() => {
  window.addEventListener("load", () => (loadingScreen.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (document.querySelector(".no-line")) return;
    document.querySelectorAll(".focus").forEach((el) => {
      el.className = el.className.replace("focus", "no-line");
    });
  });

  window.addEventListener("keydown", (e) => {
    if ((e.key && e.key.toLowerCase() !== "tab") || document.querySelector(".focus")) return;
    document.querySelectorAll(".no-line").forEach((el) => {
      el.className = el.className.replace("no-line", "focus");
    });
  });
})();

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
    await Http.post(window.location.origin + "/api/signup", userInfo);
    location.reload();
  } catch (error) {
    signupError.style.display = "block";
    signupError.innerHTML = error.message;
  }
}

async function onLogin(e) {
  e.preventDefault();
  const { username, psw } = e.target;
  const userCredentials = {
    username: username.value,
    psw: psw.value,
  };
  try {
    await Http.post(window.location.origin + "/api/login", userCredentials);
    location.reload();
  } catch (error) {
    loginError.innerHTML = error.message;
  }
}

document.forms[1].addEventListener("submit", onSignup);
document.forms[0].addEventListener("submit", onLogin);
