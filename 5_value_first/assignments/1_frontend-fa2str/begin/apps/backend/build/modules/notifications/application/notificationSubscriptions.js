"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsSubscriptions = void 0;
const memberReputationLevelUpgraded_1 = require("../../members/domain/memberReputationLevelUpgraded");
const notificationCommands_1 = require("../notificationCommands");
class NotificationsSubscriptions {
    constructor(eventBus, notificationService) {
        this.eventBus = eventBus;
        this.notificationService = notificationService;
        this.setupSubscriptions();
    }
    setupSubscriptions() {
        this.eventBus.subscribe(memberReputationLevelUpgraded_1.MemberReputationLevelUpgraded.name, this.onMemberReputationLevelUpgraded.bind(this));
    }
    onMemberReputationLevelUpgraded(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new notificationCommands_1.SendNotificationCommand({
                    memberId: event.data.memberId,
                    correspondingEventName: 'MemberReputationLevelUpgraded'
                });
                yield this.notificationService.sendNotification(command);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.NotificationsSubscriptions = NotificationsSubscriptions;
