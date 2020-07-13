"use strict";

class Http {
  static get(url, type) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve(xhr.response || xhr.responseText);
        return reject(new Error(xhr.response || xhr.responseText));
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
        if (xhr.status >= 200 && xhr.status < 300) return resolve(xhr.response);
        return reject(new Error(xhr.response || xhr.responseText));
      };
      xhr.onerror = (error) => reject(new Error("NetworkError: Please check your connection(!)"));
      xhr.send(JSON.stringify(data));
    });
  }
}
