class MailHandler {
  constructor(router, mailer, twilio, config) {
    this.router = router;
    this.mailTransporter = mailer.createTransport(config.mailer);
    this.smsTransporter = twilio(config.twilio.accountSID, config.twilio.authToken);
    this.phoneNumber = config.twilio.phoneNumber;
  }

  sendConfirmationLink(user, token) {
    if (Number.isNaN(Number.parseInt(user.username))) return this.sendConfirmationByEmail(user, token);
    return this.sendConfirmationBySMS(user, token);
  }

  sendConfirmationByEmail(user, token) {
    console.log("User: ", user);
    const mailOptions = {
      from: '"LetsDoHobby" <contact@kawaraa.com>', // sender address
      to: "", // list of receivers
      subject: "LetsDoHobby account confirmation", // Subject line
      html: "", // html body
    };
    const url = (process.env.ORIGIN || "http://localhost:8080") + "/api/confirm/" + token;
    mailOptions.html = `<a href="${url}" id="k-logo">Click here to confirm your LetsDoHobby account</a>`;
    mailOptions.to = user.username;

    return new Promise((resolve, reject) => {
      const cb = (error, info) => (error ? reject(error) : resolve(info));
      this.mailTransporter.sendMail(mailOptions, cb);
    });
  }

  async sendConfirmationBySMS(user, token) {
    const url = (process.env.ORIGIN || "http://localhost:8080") + "/api/confirm/" + token;
    const message = {
      body: `To confirm your LetsDoHobby account please use this link: ${url}`,
      from: this.phoneNumber,
      to: `+${Number.parseInt(user.username)}`,
    };
    return await this.smsTransporter.messages.create(message);
  }
}

module.exports = MailHandler;
