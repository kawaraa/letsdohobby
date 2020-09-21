"use strict";

class Http {
  static get(url, type) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = () => {
        const response = Http.parseJSON(xhr.response || xhr.responseText);
        return xhr.status >= 200 && xhr.status < 300 ? resolve(response) : reject(response);
      };
      xhr.onerror = (error) => reject(new Error("NetworkError: Please check your connection(!)"));
      xhr.send();
    });
  }

  static post(url, data, method = "POST", header = { "Content-Type": "application/json" }) {
    // "application/json", "x-www-form-urlencoded", "text/plain", text/html
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      for (let key in header) {
        xhr.setRequestHeader(key, header[key]);
      }
      xhr.onload = () => {
        const response = Http.parseJSON(xhr.response || xhr.responseText);
        return xhr.status >= 200 && xhr.status < 300 ? resolve(response) : reject(response);
      };
      xhr.onerror = (error) => reject(new Error("NetworkError: Please check your connection(!)"));
      xhr.send(Http.toJSON(data));
    });
  }

  static toJSON(data) {
    try {
      const json = JSON.stringify(data);
      return json;
    } catch (e) {}
    return data;
  }
  static parseJSON(data) {
    try {
      const json = JSON.parse(data);
      return json;
    } catch (e) {}
    return data;
  }
}

class CustomDate {
  static toString(date) {
    if (typeof date === "string") date.replace(".000Z", "");
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
  }
  static toText(date) {
    const dateFormat = {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const todayDate = new Date();
    const eventDate = new Date(date);
    const theTime = eventDate.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" });
    const theDate = eventDate.toLocaleDateString("default", dateFormat);
    let second = (Date.parse(todayDate) - Date.parse(eventDate)) / 1000;
    if (Number.isNaN(second)) throw Error("Invalid Date(!)");
    let mins = Math.ceil(second / 60);
    let hrs = Math.round(mins / 60);
    let days = Math.round(hrs / 24);

    if (second < 0) {
      second = second * -1;
      mins = Math.ceil(second / 60);
      hrs = Math.round(mins / 60);
      days = Math.round(hrs / 24);
      if (second < 60) return `in less then a min`;
      if (mins < 60) return `in ${mins} mins`;
      if (todayDate.getDate() === eventDate.getDate()) return `today at ${theTime}`;
      if (todayDate.getDate() === eventDate.getDate() - 1) return `tomorrow at ${theTime}`;
      // if (days > 1 && days < 7) return `In ${days} days`;
      // if (days === 7) return `In a week ago`;
      return `on ${theDate}`;
    }
    if (second < 60) return `less then a min ago`;
    if (mins < 60) return `${mins} mins ago`;
    if (todayDate.getDate() === eventDate.getDate() && hrs < 24) return `${hrs} hrs ago`;
    if (todayDate.getDate() === eventDate.getDate() + 1 && days < 2) return `yesterday at ${theTime}`;
    if (days > 1 && days < 7) return `${days} days ago`;
    if (days === 7) return `a week ago`;
    return `${theDate}`;
  }
}
