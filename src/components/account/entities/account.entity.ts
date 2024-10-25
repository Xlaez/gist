import { Campus } from "@/components/campus/entities/campus.entity";
import { Moderator } from "@/components/campus/entities/moderator.entity";
import { Gist } from "@/components/gist/entities/gist.entity";
import { Likes } from "@/components/gist/entities/like.entity";
import { Popularity } from "@/components/popularity/entities/popularity.entity";
import { Report } from "@/components/reports/entities/report.entity";
import { Subscription } from "@/components/subscription/entities/subscription.entity";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BeforeInsert,
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

@ObjectType()
@Entity()
@Index("Account_index_0", ["campus", "gist_id", "name", "email"])
export class Account {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field((type) => String, {
    nullable: true,
    description: "Equivalent for username",
  })
  @Column({ unique: true, length: 50, nullable: true })
  gist_id?: string;

  @Field((type) => Boolean)
  @Column({ default: false })
  is_banned: boolean;

  @Field(() => Campus, { nullable: true })
  @ManyToOne(() => Campus, (campus) => campus.accounts, { nullable: true })
  @JoinColumn({ name: "campus_id" })
  campus?: Campus;

  @Field(() => Boolean)
  @Column({ default: false })
  is_deactivated: boolean;

  @Field((type) => Boolean)
  @Column({ default: false })
  is_verified: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  is_subscribed: boolean;

  @Field(() => String, { nullable: true })
  @Column({ length: 150, nullable: true })
  name?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  dob?: Date;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, length: 255, nullable: true })
  email?: string;

  @Field(() => String, {
    description: "Generate a random avatar on account creation",
  })
  @Column({ type: "text" })
  avatar: string;

  @Field(() => String, { nullable: true })
  @Column({ length: 50, nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  @Column({ length: 255, nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  @Column({ length: 255, nullable: true })
  quote?: string;

  @Column({ type: "text", nullable: true })
  password?: string;

  @Field(() => String)
  @Column({ length: 50 })
  login_type: string;

  @Field(() => String)
  @Column({ default: false })
  two_factor_auth: boolean;

  @Field(() => String)
  @Column({ default: true })
  send_notifications: boolean;

  // Relationships
  @ManyToOne(() => Popularity, (popularity) => popularity.accounts)
  @JoinColumn({ name: "popularity" })
  popularity: Popularity;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Gist, (gist) => gist.account)
  gists: Gist[];

  @OneToMany(() => Report, (report) => report.reporter)
  reportsMade: Report[];

  @OneToMany(() => Report, (report) => report.reported)
  reportsReceived: Report[];

  @OneToMany(() => Subscription, (subscription) => subscription.account)
  subscriptions: Subscription[];

  @OneToMany(() => Likes, (likes) => likes.account)
  likes: Likes[];

  @OneToMany(() => Moderator, (moderator) => moderator.account)
  moderators: Moderator[];

  @BeforeInsert()
  generateAvatar() {
    if (!this.avatar) {
      this.avatar = "https://example.com/default-avatar.png"; // update to a random picking from an array of avatars
    }
  }
}
