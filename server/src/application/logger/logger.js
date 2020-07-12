class Logger {
  constructor(name = "") {
    this.name = name;
  }
  info() {
    console.log(`[#]-[${this.name}] `, ...arguments);
  }
  warn() {
    console.warn(`[X]-[${this.name}] `, ...arguments);
  }
  error() {
    console.error(`[ERROR]-[${this.name}] `, ...arguments);
  }
}

module.exports = Logger;
