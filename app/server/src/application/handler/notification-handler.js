const Validator = require("../../my-npm/validator");

class NotificationHandler {
  constructor(socket, notificationRepository, chatRepository) {
    this.socket = socket;
    this.notificationRepository = notificationRepository;
    this.chatRepository = chatRepository;
  }

  async handleJoinRequest(user, { id, owner, activity, members } = group) {
    try {
      const text = `${user.displayName}] would like to enjoy] ${activity}] with you`;
      const createdAt = Validator.formatDate(new Date());
      const nots = { subjectId: user.id, objectId: id, type: "join-request", text, unseen: 1, createdAt };

      const notifications = members.map((member) => ({ receiver: member.id, ...nots }));
      if (!members[0]) notifications.push({ receiver: owner, ...nots });

      await Promise.all(
        await notifications.map(async (notification) => {
          notification.id = (23456789 * Math.random()).toString();
          await this.notificationRepository.create(notification);
          notification.payload = { id: notification.id };
          this.socket.dispatchEvent("ADD_NOTIFICATION", notification);
        })
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async handleCancelJoinRequest(user, group) {
    const notifications = await this.notificationRepository.getBySubjectIdAndObjectId(user.id, group.id);
    notifications.map((notification) => {
      this.socket.dispatchEvent("REMOVE_NOTIFICATION", { receiver: group.owner, payload: notification });
    });
    await this.notificationRepository.deleteBySubjectIdAndObjectId(user.id, group.id);
  }

  async handleRejectRequest(userInfo, group, notificationId, date) {
    const { id, owner, members, requesterName, requesterId } = group;
    if (!members[0]) {
      await this.notificationRepository.deleteBySubjectIdAndObjectId(requesterId, group.id);
      const removeNotification = { receiver: owner, payload: { id: notificationId } };
      return this.socket.dispatchEvent("REMOVE_NOTIFICATION", removeNotification);
    }

    const content = `${userInfo.displayName}, rejected, ${requesterName}`;
    let msg = { chatId: id, content, type: "reject", createdAt: date };
    const message = await this.chatRepository.createMessage(userInfo, msg);

    await this.notificationRepository.deleteBySubjectIdAndObjectId(requesterId, group.id);

    members.forEach((member) => {
      this.socket.dispatchEvent("NEW_UNSEEN_CHAT", { receiver: member.id, payload: { id } });
      this.socket.dispatchEvent("NEW_MESSAGE", { receiver: member.id, payload: message });
      const removeNotification = { receiver: member.id, payload: { id: notificationId } };
      this.socket.dispatchEvent("REMOVE_NOTIFICATION", removeNotification);
    });
  }

  async handleAcceptRequest(userInfo, group, notificationId, date) {
    const { id, members, newMemberName, newMemberId } = group;
    const content = `${userInfo.displayName}, accepted, ${newMemberName}`;

    let msg = { chatId: id, content, type: "accept", createdAt: date };
    const message = await this.chatRepository.createMessage(userInfo, msg);
    await this.notificationRepository.deleteBySubjectIdAndObjectId(newMemberId, group.id);

    members.forEach((member) => {
      this.socket.dispatchEvent("NEW_UNSEEN_CHAT", { receiver: member.id, payload: { id } });
      this.socket.dispatchEvent("NEW_MESSAGE", { receiver: member.id, payload: message });
      const removeNotification = { receiver: member.id, payload: { id: notificationId } };
      this.socket.dispatchEvent("REMOVE_NOTIFICATION", removeNotification);
    });
  }

  handleNewMessage(group, message) {
    group.members.forEach((member) => {
      if (member.id === message.owner.id) return;
      this.socket.dispatchEvent("NEW_UNSEEN_CHAT", { receiver: member.id, payload: { id: group.id } });
      this.socket.dispatchEvent("NEW_MESSAGE", { receiver: member.id, payload: message });
    });
  }
}

module.exports = NotificationHandler;
