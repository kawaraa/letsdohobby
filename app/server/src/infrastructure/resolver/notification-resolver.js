const CustomError = require("../../domain/model/custom-error");

class NotificationResolver {
  constructor(server, firewall, notificationRepository) {
    this.server = server;
    this.firewall = firewall;
    this.notificationRepository = notificationRepository;
  }

  resolve() {
    this.server.use("/notification", this.firewall.authRequired);
    this.server.get("/notification", this.getUnseenNotifications.bind(this));
    this.server.get("/notification/list", this.getNotificationList.bind(this));
  }
  async getUnseenNotifications(request, response) {
    try {
      const notifications = await this.notificationRepository.getUnseenByOwner(request.user.id);
      response.json(notifications);
    } catch (error) {
      console.log(error);
    }
  }
  async getNotificationList(request, response) {
    try {
      const notificationList = await this.notificationRepository.getListByOwner(request.user.id);
      response.json(notificationList);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = NotificationResolver;
