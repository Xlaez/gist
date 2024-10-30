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
import { Campus } from "./campus.entity";

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

  @Field(() => Campus)
  @ManyToOne(() => Campus, (campus) => campus.moderators)
  @JoinColumn({ name: "campus_id" })
  campus: Campus;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
