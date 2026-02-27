"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const sendNotification_1 = require("./useCases/sendNotification/sendNotification");
class NotificationsService {
    constructor(transactionalEmailAPI) {
        this.transactionalEmailAPI = transactionalEmailAPI;
    }
    sendNotification(command) {
        return new sendNotification_1.SendNotification(this.transactionalEmailAPI).execute(command);
    }
}
exports.NotificationsService = NotificationsService;
