class ConfirmationResolver {
  constructor(router, firewall, accountRepository, mailHandler) {
    this.router = router;
    this.firewall = firewall;
    this.accountRepository = accountRepository;
    this.mailHandler = mailHandler;
  }
  resolve() {
    this.router.get("/confirm/:token", this.confirmAccountByToken.bind(this));
  }

  async confirmAccountByToken(request, response) {
    try {
      const { id } = this.firewall.parseToken(request.params.token);
      const user = await this.accountRepository.getAccountById(id);
      if (user.confirmed > 0) return response.send(`<h1>Account has been already confirmed.</h1>`);
      await this.accountRepository.confirmAccount(id);
      response.send(`<h1 style="color:green;">Account has been confirmed successfully</h1>`);
    } catch (error) {
      response.status(500).end(`<h1 style="color:red;">TOKEN is not valid</h1>`);
    }
  }
}

module.exports = ConfirmationResolver;
