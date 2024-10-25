import { Account } from "@/components/account/entities/account.entity";
import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SubscriptionService } from "./subscription_service.entity";

@ObjectType()
@Entity()
@Index("subscription_index_0", ["account", "service"])
export class Subscription {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.subscriptions)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Field(() => SubscriptionService)
  @ManyToOne(() => SubscriptionService, (service) => service.subscriptions)
  @JoinColumn({ name: "service_id" })
  service: SubscriptionService;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
