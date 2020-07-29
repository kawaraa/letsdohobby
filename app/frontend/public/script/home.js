"use strict";

const loadingScreen = document.getElementById("loading-screen-wrapper");
const signupError = document.getElementById("signup-error");
const loginError = document.querySelector(".login-error");
const messageScreen = document.getElementById("screen-message");

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
    gender: form.gender.value,
  };
  try {
    await Http.post(window.location.origin + "/api/signup", userInfo);
    form.reset();
    signupError.style.display = "none";
    messageScreen.style.display = "block";
    //  location.reload()
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
window.addEventListener("click", (e) => {
  const form = document.querySelector(".nav.login-form");
  if (!form || !e.target.className) return;
  if (e.target.className === "login-form-close") {
    form.reset();
    loginError.innerHTML = "";
    form.style.top = "-" + form.offsetHeight + "px";
  } else if (e.target.className === "nav btn login") {
    form.style.top = "80px";
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
});

function hideMe(element) {
  element.style.display = "none";
}

let prevScroll = window.pageYOffset;
window.onscroll = (_, currentScroll = window.pageYOffset) => {
  const navbar = document.querySelector(".navbar.outer-container");
  if (prevScroll > currentScroll) navbar.style.top = "0";
  else navbar.style.top = `-${navbar.offsetHeight}px`;
  prevScroll = currentScroll;
};
