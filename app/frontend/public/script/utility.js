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

  static post(url, data, method = "POST", type = "application/json") {
    // "application/json", "x-www-form-urlencoded", "text/plain", text/html
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", type);
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
