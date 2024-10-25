import { Account } from "@/components/account/entities/account.entity";
import { Campus } from "@/components/campus/entities/campus.entity";
import { Popularity } from "@/components/popularity/entities/popularity.entity";
import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Media } from "./media.entity";

@ObjectType()
@Entity()
@Index("gist_index_0", ["account", "campus", "text", "tags", "id"])
export class Gist {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.gists)
  @JoinColumn({ name: "account_id" })
  account: Account;

  @Field(() => Campus)
  @ManyToOne(() => Campus, (campus) => campus.gists)
  @JoinColumn({ name: "campus_id" })
  campus: Campus;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  text?: string;

  @Field()
  @Column({ default: true })
  is_public: boolean;

  @Field()
  @Column({ default: false })
  is_deleted: boolean;

  @Field()
  @Column({ length: 15, default: "gist" })
  type: string;

  @Field(() => [String], { nullable: true })
  @Column("varchar", { length: 150, array: true, nullable: true })
  tags?: string[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Int)
  @Column({ default: 0 })
  views: number;

  @Field(() => Int)
  @Column({ default: 0 })
  likes_count: number;

  @Field()
  @Column({ default: false })
  has_parent: boolean;

  @Field({ nullable: true })
  @Column({ type: "uuid", nullable: true })
  parent_id?: string;

  // Relationships
  @ManyToOne(() => Popularity, (popularity) => popularity.gists)
  @JoinColumn({ name: "popularity" })
  popularity: Popularity;

  @OneToMany(() => Media, (media) => media.gist)
  media: Media[];
}
