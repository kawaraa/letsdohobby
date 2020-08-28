import React, { useState } from "react";
import "./date-and-time-field.css";

const DateAndTimeField = ({ date }) => {
  const maxDate = new Date(),
    currentYear = date.getFullYear(),
    currentMonth = date.getMonth() + 1,
    currentDay = date.getDate(),
    currentHour = date.getHours(),
    currentMinute = date.getMinutes(),
    hours = [],
    minutes = [];

  const [monthDays, setMonthDays] = useState(new Date(currentYear, currentMonth, 0).getDate());

  maxDate.setMonth(currentMonth);

  const handleMonthChange = (e) => setMonthDays(new Date(currentYear, e.target.value, 0).getDate());

  const getDays = (option = []) => {
    for (let i = 1; i <= monthDays; i += 1) {
      let item = <option value={i}>{i}</option>;
      if (i === currentDay) {
        item = (
          <option value={i} selected>
            {i}
          </option>
        );
      }
      option.push(item);
    }
    return option;
  };

  for (let i = 0; i <= 60; i += 1) {
    let num = i;
    if (i < 10) num = "0" + i;
    let item = <option value={num}>{num}</option>;
    if (i === currentMinute) {
      item = (
        <option value={num} selected>
          {num}
        </option>
      );
    }
    minutes.push(item);

    if (i > 5 && i < 24) {
      item = <option value={num}>{num}</option>;
      if (i === currentHour)
        item = (
          <option value={num} selected>
            {num}
          </option>
        );
      hours.push(item);
    }
  }

  return (
    <div className="create-post date-time">
      <div className="create-post date">
        <select name="month" onChange={handleMonthChange} className="no-line" title="Month">
          <option value={currentMonth} selected>
            {date.toLocaleString("en-us", { month: "short" })}
          </option>
          <option value={currentMonth + 1}>{maxDate.toLocaleString("en-us", { month: "short" })}</option>
        </select>
        <span className="create-post date-dash">-</span>
        <select name="day" className="no-line" title="Day">
          {getDays()}
        </select>
      </div>

      <div className="create-post time">
        <select name="hour" className="no-line" title="Hour">
          {hours}
        </select>
        <span className="create-post time-colon">:</span>
        <select name="minute" className="no-line" title="Media items">
          {minutes}
        </select>
      </div>
    </div>
  );
};

export default DateAndTimeField;
