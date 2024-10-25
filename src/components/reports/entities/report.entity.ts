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
import { ReportType } from "../enums";

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
  reporter: typeof Account;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.reportsReceived)
  @JoinColumn({ name: "reported" })
  reported: typeof Account;

  @Field(() => String)
  @Column({ length: 255 })
  reason: string;

  @Field(() => String)
  @Column({ type: "enum", default: ReportType.account, enum: ReportType })
  report_type: typeof ReportType;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;
}
