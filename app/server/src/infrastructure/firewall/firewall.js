const UserInfo = require("../../domain/model/user-info");
const CustomError = require("../../domain/model/custom-error");
class Firewall {
  constructor(cookie, jwt, config) {
    this.cookie = cookie;
    this.jwt = jwt;
    this.config = config;
    this.authRequired = this.checkAuthentication.bind(this);
  }

  checkAuthentication(request, response, next) {
    const user = this.checkToken(request.headers.cookie, request.connection.remoteAddress);
    if (!user) return response.status(401).end(CustomError.toJson(new CustomError("Unauthorized request")));
    request.user = new UserInfo(user);
    response.locals.user = request.user;
    next();
  }
  isAuthenticated(request) {
    if (!this.checkToken(request.headers.cookie, request.connection.remoteAddress)) return false;
    return true;
  }
  isLoggedIn(request) {
    if (!request.headers.cookie) return false;
    const user = this.checkToken(request.headers.cookie, request.connection.remoteAddress);
    if (!user) return false;
    request.user = new UserInfo(user);
    return true;
  }

  checkToken(cookie, ip) {
    console.log("Cookie: ", cookie);
    console.log("Cookie type: ", typeof cookie);
    console.log("Cookie type: ", cookie || "aaaaa");
    const userToken = this.cookie.parse(cookie)["userToken"];
    const decodedUser = this.parseToken(userToken);
    // Check the client IP by adding, || decodedUser.ip !==ip
    return decodedUser;
  }
  parseToken(token) {
    try {
      return this.jwt.verify(token, this.config.secretKey).payload;
    } catch (error) {
      return null;
    }
  }
  createToken(payload) {
    try {
      return this.jwt.sign({ payload }, this.config.secretKey);
    } catch (error) {
      return null;
    }
  }
  updateToken(user, response) {
    const token = this.createToken(user);
    response.cookie("userToken", token, this.config.cookieOption);
  }
}

module.exports = Firewall;
