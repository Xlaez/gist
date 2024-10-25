import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subscription } from "./subscription.entity";

@ObjectType()
@Entity({ name: "Subscription_service" })
@Index("subscription_service_index_0", ["id", "type"])
export class SubscriptionService {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  type: string;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @OneToMany(() => Subscription, (subscription) => subscription.service)
  subscriptions: Subscription[];
}
