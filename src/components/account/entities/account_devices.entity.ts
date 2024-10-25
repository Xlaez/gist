import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";

@ObjectType()
@Entity()
@Index("Account_device_index_0", ["account", "device_type", "time_zone"])
export class AccountDevice {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Account, { nullable: true })
  @ManyToOne(() => Account, (account) => account.devices)
  @JoinColumn({ name: "account_id" })
  account: typeof Account;

  @Field(() => String)
  @Column({ length: 100, type: "varchar" })
  device_id: string;

  @Field(() => String)
  @Column({ length: 50, type: "varchar" })
  device_type: string;

  @Field(() => String)
  @Column({ length: 30, type: "varchar" })
  device_os: string;

  @Field(() => String)
  @Column({ length: 20, type: "varchar" })
  app_version: string;

  @Field(() => String)
  @Column({ length: 50, type: "varchar" })
  time_zone: string;

  @Field(() => String)
  @Column({ type: "text" })
  session_token: string;

  @Field(() => String)
  @Column({ type: "text" })
  ip_address: string;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  last_active: Date;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  login_time: Date;

  @Field(() => Boolean)
  @Column({ type: "boolean" })
  is_revoked: Boolean;

  @Field(() => Date)
  @Column({ type: "timestamp" })
  created_at: Date;
}
