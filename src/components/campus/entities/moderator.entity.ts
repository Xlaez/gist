import { Account } from "@/components/account/entities/account.entity";
import { Field, ID, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
@Index("moderator_index_0", ["id", "account"])
export class Moderator {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.moderators)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
