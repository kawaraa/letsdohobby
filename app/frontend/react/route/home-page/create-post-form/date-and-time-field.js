import React from "react";
import "./date-and-time-field.css";

class DateAndTimeField extends React.Component {
  constructor(props) {
    super(props);
    this.onMonthChange = this.handleMonthChange.bind(this);
    this.date = new Date();
    this.state = { defaultMonth: 0, defaultDay: 0, defaultHour: 0, defaultMinute: 0, monthDays: 0 };
  }

  handleMonthChange({ target } = e) {
    const monthDays = new Date(this.date.getFullYear(), target.value, 0).getDate();
    this.setState({ monthDays });
  }
  getDays() {
    const option = [];
    for (let i = 1; i <= this.state.monthDays; i += 1) {
      let item = <option value={i}>{i}</option>;
      if (i === this.state.defaultDay) {
        item = (
          <option value={i} selected>
            {i}
          </option>
        );
      }
      option.push(item);
    }
    return option;
  }

  componentDidMount() {
    const date = this.props.defaultDate || this.date;

    const monthDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    const defaultMonth = date.getMonth() + 1,
      defaultDay = date.getDate(),
      defaultHour = date.getHours() + 1,
      defaultMinute = date.getMinutes();
    this.setState({ monthDays, defaultMonth, defaultDay, defaultHour, defaultMinute });
  }

  render() {
    const { defaultMonth, defaultHour, defaultMinute } = this.state,
      date = new Date(),
      hours = [],
      minutes = [];
    date.setMonth(this.date.getMonth() + 1);

    for (let i = 0; i <= 60; i += 1) {
      let num = i;
      if (i < 10) num = "0" + i;
      let item = <option value={num}>{num}</option>;
      if (i === defaultMinute) {
        item = (
          <option value={num} selected>
            {num}
          </option>
        );
      }
      minutes.push(item);
      if (i > 5 && i < 24) {
        item = <option value={num}>{num}</option>;
        if (i === defaultHour)
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
          <select name="month" onChange={this.onMonthChange} className="no-line" title="Month">
            <option value={this.date.getMonth() + 1} selected={defaultMonth === this.date.getMonth() + 1}>
              {this.date.toLocaleString("en-us", { month: "short" })}
            </option>
            <option value={date.getMonth() + 1} selected={defaultMonth === date.getMonth() + 1}>
              {date.toLocaleString("en-us", { month: "short" })}
            </option>
          </select>
          <span className="create-post date-dash">-</span>
          <select name="day" className="no-line" title="Day">
            {this.getDays()}
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
  }
}

export default DateAndTimeField;
