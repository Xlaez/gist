import { AppDataSource } from "@/shared/configs/data_source";
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { Repository } from "typeorm";
import { CreateNotificationInput } from "../inputs/notification.input";
import { Account } from "@/components/account/entities/account.entity";
import { Notification } from "../entities/notification.entity";
import { NotFoundError } from "@dolphjs/graphql/common";

export class NotificationService extends DolphServiceHandler<Dolph> {
  private readonly notificationRepo: Repository<Notification>;

  constructor() {
    super("notificationService");
    this.notificationRepo = AppDataSource.getRepository(Notification);
  }

  async createNotification(
    data: CreateNotificationInput,
    account: Account
  ): Promise<Partial<Notification>> {
    const notification = this.notificationRepo.create({ ...data, account });
    return this.notificationRepo.save(notification);
  }

  async getNotificationByID(id: string): Promise<Notification> {
    return this.notificationRepo.findOne({
      where: { id },
    });
  }

  async markRead(id: string) {
    let notification = await this.notificationRepo.findOne({ where: { id } });

    if (!notification) throw new NotFoundError("Cannot find notification");

    notification.has_been_read = true;

    notification = await this.notificationRepo.save(notification);

    return notification;
  }

  async deleteNotification(id: string) {
    return this.notificationRepo.softDelete({ id });
  }
}
