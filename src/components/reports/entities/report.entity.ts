import { Account } from "@/components/account/entities/account.entity";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
@Index("report_index_0", ["report_type", "id"])
export class Report {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.reportsMade)
  @JoinColumn({ name: "reporter" })
  reporter: Account;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.reportsReceived)
  @JoinColumn({ name: "reported" })
  reported: Account;

  @Field()
  @Column({ length: 255 })
  reason: string;

  @Field()
  @Column({ length: 50, default: "account" })
  report_type: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
