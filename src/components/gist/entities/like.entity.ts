import { Account } from "@/components/account/entities/account.entity";
import { Campus } from "@/components/campus/entities/campus.entity";
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
@Index("likes_index_0", ["account", "campus", "id"])
export class Likes {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.likes)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Field(() => Campus)
  @ManyToOne(() => Campus)
  @JoinColumn({ name: "campus_id" })
  campus: Campus;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
