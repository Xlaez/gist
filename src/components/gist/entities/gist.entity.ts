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
import { GistType } from "../enums";

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
  account: typeof Account;

  @Field(() => Campus)
  @ManyToOne(() => Campus, (campus) => campus.gists)
  @JoinColumn({ name: "campus_id" })
  campus: typeof Campus;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  text?: string;

  @Field(() => Boolean)
  @Column({ default: true })
  is_public: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  is_deleted: boolean;

  @Field(() => String)
  @Column({ default: GistType.gist, type: "enum", enum: GistType }) /// update to an enum
  type: string;

  @Field(() => [String], { nullable: true })
  @Column("varchar", { length: 150, array: true, nullable: true })
  tags?: string[];

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Int)
  @Column({ default: 0 })
  views: number;

  @Field(() => Int)
  @Column({ default: 0 })
  likes_count: number;

  @Field(() => Boolean)
  @Column({ default: false })
  has_parent: boolean;

  @Field(() => String, { nullable: true })
  @Column({ type: "uuid", nullable: true })
  parent_id?: string;

  // Relationships
  @ManyToOne(() => Popularity, (popularity) => popularity.gists)
  @JoinColumn({ name: "popularity" })
  popularity: typeof Popularity;

  @OneToMany(() => Media, (media) => media.gist)
  media: (typeof Media)[];
}
