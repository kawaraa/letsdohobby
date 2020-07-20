"use strict";

const loadingScreen = document.getElementById("loading-screen-wrapper");
const signupError = document.getElementById("signup-error");
const loginError = document.querySelector("login-error");

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

async function onSignup(form) {
  window.event.preventDefault();
  const { firstName, lastName, username, psw, pswConfirm, birthdayDay, birthdayMonth, birthdayYear } = form;
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

async function onLogin({ username, psw } = form) {
  window.event.preventDefault();
  const userCredentials = { username: username.value, psw: psw.value };
  try {
    await Http.post(window.location.origin + "/api/login", userCredentials);
    location.reload();
  } catch (error) {
    loginError.innerHTML = error.message;
  }
}

function showLoginForm() {
  const form = document.querySelector(".intro.login-form");
  if (form && form.offsetHeight > 0) form.style.height = "0px";
  else if (form) form.style.height = "110px";
}

let prevScroll = window.pageYOffset;
window.onscroll = (_, currentScroll = window.pageYOffset) => {
  if (prevScroll > currentScroll) document.querySelector(".navbar.outer-container").style.top = "0";
  else document.querySelector(".navbar.outer-container").style.top = "-700px";
  prevScroll = currentScroll;
};
