const CustomError = require("../../domain/model/custom-error");

class MemberResolver {
  constructor(server, firewall, memberRepository) {
    this.server = server;
    this.firewall = firewall;
    this.memberRepository = memberRepository;
  }

  resolve() {
    this.server.use("/member", this.firewall.authRequired);
    this.server.get("/member/:id", this.getMember.bind(this));
    this.server.get("/member/profile/:id", this.getMemberProfile.bind(this));
  }

  async getMember(request, response) {
    try {
      const member = await this.memberRepository.getMemberBasicInfo(request.params.id);
      response.json(member);
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
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
