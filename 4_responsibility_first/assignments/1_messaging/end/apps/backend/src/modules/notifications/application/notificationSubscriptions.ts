
import { EventBus } from "@dddforum/bus";
import { MemberReputationLevelUpgraded } from "../../members/domain/memberReputationLevelUpgraded";
import { SendNotificationCommand } from "../notificationCommands";
import { NotificationsService } from "./notificationsService";

export class NotificationsSubscriptions {
  constructor(
    private eventBus: EventBus,
    private notificationService: NotificationsService
  ) {
    this.setupSubscriptions();
  }

  private async setupSubscriptions() {
    await this.eventBus.subscribe<MemberReputationLevelUpgraded>(
      MemberReputationLevelUpgraded.name,
      this.onMemberReputationLevelUpgraded.bind(this),
      {
        durableName: "notifications-member-reputation-Level-upgraded-channel"
      }
    );
  }

  async onMemberReputationLevelUpgraded(event: MemberReputationLevelUpgraded) {
    try {
      const command = new SendNotificationCommand({
        memberId: event.data.memberId,
        correspondingEventName: "MemberReputationLevelUpgraded"
      });
      await this.notificationService.sendNotification(command);
    } catch (error) {
      console.log(error);
    }
  }
}




