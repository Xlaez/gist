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
import { serverConfigs } from "./envs.config";
import { Report } from "@/components/reports/entities/report.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "password123",
  database: "gist",
  entities: [
    Gist,
    Account,
    AccountDevice,
    Likes,
    Campus,
    Popularity,
    Media,
    Report,
    Subscription,
    SubscriptionService,
  ],
  synchronize: serverConfigs.env === "production",
  logging: true,
  migrations: [__dirname + "/migration/*.ts"],
});
