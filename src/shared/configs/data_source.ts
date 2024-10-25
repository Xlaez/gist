import { Account } from "@/components/account/entities/account.entity";
import { AccountDevice } from "@/components/account/entities/account_devices.entity";
import { Campus } from "@/components/campus/entities/campus.entity";
import { Gist } from "@/components/gist/entities/gist.entity";
import { Likes } from "@/components/gist/entities/like.entity";
import { Media } from "@/components/gist/entities/media.entity";
import { Popularity } from "@/components/popularity/entities/popularity.entity";
import { Subscription } from "@/components/subscription/entities/subscription.entity";
import { SubscriptionService } from "@/components/subscription/entities/subscription_service.entity";
import { DataSource } from "typeorm";
import { postgresConfig, serverConfigs } from "./envs.config";
import { Report } from "@/components/reports/entities/report.entity";
import { Moderator } from "@/components/campus/entities/moderator.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: postgresConfig.port,
  username: postgresConfig.user,
  password: postgresConfig.pass,
  database: postgresConfig.db,
  entities: [
    Gist,
    Account,
    AccountDevice,
    Likes,
    Campus,
    Popularity,
    Media,
    Report,
    Moderator,
    Subscription,
    SubscriptionService,
  ],
  synchronize: serverConfigs.env === "production",
  logging: true,
  migrations: [__dirname + "/migration/*.ts"],
});
