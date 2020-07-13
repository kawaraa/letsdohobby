"use strict";
const minDay = 2,
  maxDay = 31,
  minYear = 1840,
  maxYear = 2001,
  months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

function createOptionElement(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.innerText = text;
  return option;
}

function renderDays(min, max, parent) {
  for (let day = min; day <= max; day += 1) {
    if (day < 10) parent.appendChild(createOptionElement("0" + day, "0" + day));
    else parent.appendChild(createOptionElement(day, day));
  }
}
function renderYears(min, max, parent) {
  for (let year = max; year >= min; year -= 1) {
    parent.appendChild(createOptionElement(year, year));
  }
}

function renderDateOptions() {
  const birthdayDay = document.querySelector("select[name=birthdayDay]");
  const birthdayMonth = document.querySelector("select[name=birthdayMonth]");
  const birthdayYear = document.querySelector("select[name=birthdayYear]");
  renderDays(minDay, maxDay, birthdayDay);
  months.forEach((month) => birthdayMonth.appendChild(createOptionElement(month, month)));
  renderYears(minYear, maxYear, birthdayYear);
}
renderDateOptions();
