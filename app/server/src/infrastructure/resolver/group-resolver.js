const CustomError = require("../../domain/model/custom-error");

class GroupResolver {
  constructor(server, firewall, groupRepository, notificationHandler) {
    this.server = server;
    this.firewall = firewall;
    this.groupRepository = groupRepository;
    this.notificationHandler = notificationHandler;
  }

  resolve() {
    this.server.use("/group", this.firewall.authRequired);
    this.server.post("/group/join/:id", this.joinRequest.bind(this));
    this.server.delete("/group/cancel/:id", this.cancelRequest.bind(this));
    this.server.delete("/group/reject", this.rejectRequest.bind(this));
    this.server.post("/group/accept", this.acceptRequest.bind(this));
    // this.server.delete("group/member/:id", this.removeMember.bind(this));
    // this.server.delete("group/admin/remove-member/:id", this.adminRemoveMember.bind(this));
  }

  async getMembers(request, response) {
    try {
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }

  async joinRequest(request, response) {
    const joinRequest = { receiver: request.params.id, sender: request.user.id };
    try {
      const group = await this.groupRepository.addNewRequest(joinRequest);
      const success = await this.notificationHandler.handleJoinRequest(request.user, group);
      if (!success) {
        await this.groupRepository.removeRequest(joinRequest);
        throw new CustomError("Couldn't notify the post owner, please refresh the page and try again");
      }
      response.json({ success: true });
    } catch (error) {
      response.status(500).end(CustomError.toJson(error));
    }
  }

  async cancelRequest(request, response) {
    const joinRequest = { receiver: request.params.id, sender: request.user.id };
    try {
      const group = await this.groupRepository.removeRequest(joinRequest);
      await this.notificationHandler.handleCancelJoinRequest(request.user, group);
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }

  async rejectRequest(request, response) {
    const { notification_id, localDate } = request.query;
    try {
      const group = await this.groupRepository.removeRequestByMember(request.user, notification_id);
      await this.notificationHandler.handleRejectRequest(request.user, group, notification_id, localDate);
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }

  async acceptRequest(request, response) {
    const { notification_id, localDate } = request.query;
    try {
      const group = await this.groupRepository.addNewMember(request.user, notification_id);
      await this.notificationHandler.handleAcceptRequest(request.user, group, notification_id, localDate);
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.status(500).end(CustomError.toJson(error));
    }
  }
}

module.exports = GroupResolver;
