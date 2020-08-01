const CustomError = require("../../domain/model/custom-error");

class MemberResolver {
  constructor(server, firewall, memberRepository) {
    this.server = server;
    this.firewall = firewall;
    this.memberRepository = memberRepository;
  }

  resolve() {
    this.server.use("/member", this.firewall.authRequired);
    this.server.get("/member/:id", this.getMemberProfile.bind(this));
  }

  async getMemberProfile(request, response) {
    try {
      const memberProfile = await this.memberRepository.getMemberProfile(request.params.id);
      response.json(memberProfile);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
}

module.exports = MemberResolver;
