import { Account } from "@/components/account/entities/account.entity";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NotificationType } from "../notification.enums";

@ObjectType()
@Entity()
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  text: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.notifications)
  @JoinColumn({ name: "account" })
  account: Account;

  @Field(() => String)
  @Column({ default: NotificationType.General, enum: NotificationType })
  type: string;

  // This is the id of any type, it helps the frontend to navigate to that screen and fetch the data to be displayed. It is only added where type is not general
  @Field(() => String)
  @Column()
  id_of_type?: string;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  has_been_read: boolean;
}
