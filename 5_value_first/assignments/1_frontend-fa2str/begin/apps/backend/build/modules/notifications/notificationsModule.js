"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const applicationModule_1 = require("../../shared/modules/applicationModule");
const notificationsService_1 = require("./application/notificationsService");
const notificationSubscriptions_1 = require("./application/notificationSubscriptions");
const transactionalEmailAPISpy_1 = require("./externalServices/adapters/transactionalEmailAPI/transactionalEmailAPISpy");
class NotificationsModule extends applicationModule_1.ApplicationModule {
    constructor(eventBus, config) {
        super(config);
        this.eventBus = eventBus;
        this.transactionalEmailAPI = this.createTransactionalEmailAPI();
        this.notificationsService = this.createNotificationsService();
        this.notificationsSubscriptions = this.createNotificationSubscriptions();
    }
    static build(eventBus, config) {
        return new NotificationsModule(eventBus, config);
    }
    createNotificationSubscriptions() {
        return new notificationSubscriptions_1.NotificationsSubscriptions(this.eventBus, this.notificationsService);
    }
    createNotificationsService() {
        return new notificationsService_1.NotificationsService(this.transactionalEmailAPI);
    }
    getNotificationsService() {
        return this.notificationsService;
    }
    getTransactionalEmailAPI() {
        return this.transactionalEmailAPI;
    }
    createTransactionalEmailAPI() {
        if (this.getEnvironment() === "production") {
            return new transactionalEmailAPISpy_1.TransactionalEmailAPISpy();
        }
        /**
         * For 'testing' and 'staging', if we wanted to use a different one
         */
        // When we execute unit tests, we use this.
        return new transactionalEmailAPISpy_1.TransactionalEmailAPISpy();
    }
}
exports.NotificationsModule = NotificationsModule;
