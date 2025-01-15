import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { NotificationService } from "../services/notification.service";
import { Authenticated } from "@/shared/decorators/authentication.decorator";
import { IContext } from "@/shared/interfaces/context.interface";
import { Notification } from "../entities/notification.entity";

@Resolver(() => Notification)
export class NotificationResolver {
  private readonly notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  @Query(() => Notification)
  @Authenticated()
  async fetchNotificationByID(
    @Arg("notification_id", () => String) notification_id: string,
    @Ctx() ctx: IContext
  ): Promise<Notification> {
    try {
      return this.notificationService.getNotificationByID(notification_id);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Notification)
  @Authenticated()
  async markRead(
    @Arg("notification_id", () => String) notification_id: string
  ) {
    try {
      return this.notificationService.markRead(notification_id);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Notification)
  async deleteNotification(
    @Arg("notification_id", () => String) notification_id: string
  ) {
    try {
      return this.notificationService.deleteNotification(notification_id);
    } catch (e: any) {
      throw e;
    }
  }
}
