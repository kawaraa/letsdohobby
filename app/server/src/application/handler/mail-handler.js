class MailHandler {
  constructor(mailer, twilio) {
    this.mailTransporter = mailer.createTransport(env.NODEMAILER);
    this.smsTransporter = twilio(env.TWILIO.accountSID, env.TWILIO.authToken);
    this.phoneNumber = env.TWILIO.phoneNumber;
  }

  sendConfirmationLink(user, token) {
    if (Number.isNaN(Number.parseInt(user.username))) return this.sendConfirmationByEmail(user, token);
    return this.sendConfirmationBySMS(user, token);
  }

  sendConfirmationByEmail(user, token) {
    const url = env.ORIGIN + "/api/confirm/" + token;
    const mailOptions = {
      from: '"LetsDoHobby" <contact@kawaraa.com>', // sender address
      to: user.username, // list of receivers
      subject: "LetsDoHobby account confirmation", // Subject line
      html: `<a href="${url}" id="k-logo">Click here to confirm your LetsDoHobby account</a>`, // html body
    };

    return new Promise((resolve, reject) => {
      const cb = (error, info) => (error ? reject(error) : resolve(info));
      this.mailTransporter.sendMail(mailOptions, cb);
    });
  }

  async sendConfirmationBySMS(user, token) {
    const url = env.ORIGIN + "/api/confirm/" + token;
    const message = {
      body: `To confirm your LetsDoHobby account please use this link: ${url}`,
      from: this.phoneNumber,
      to: `+${Number.parseInt(user.username)}`,
    };
    return await this.smsTransporter.messages.create(message);
  }
}

module.exports = MailHandler;
