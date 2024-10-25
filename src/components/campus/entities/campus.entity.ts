import { Account } from "@/components/account/entities/account.entity";
import { Gist } from "@/components/gist/entities/gist.entity";
import { Popularity } from "@/components/popularity/entities/popularity.entity";
import { Field, ID, ObjectType } from "type-graphql";
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

@ObjectType()
@Entity()
@Index("campus_index_0", ["id", "name", "domain"])
export class Campus {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true, length: 255 })
  name: string;

  @Field()
  @Column({ type: "text" })
  domain: string;

  @Field()
  @Column({ type: "text" })
  cover_img: string;

  @Field()
  @Column({ length: 255 })
  description: string;

  @Field()
  @Column({ default: false })
  is_deleted: boolean;

  @Field()
  @Column({ default: false })
  locked: boolean;

  @Field()
  @Column({ default: false })
  is_banned: boolean;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Popularity, (popularity) => popularity.campuses)
  @JoinColumn({ name: "popularity" })
  popularity: Popularity;

  @OneToMany(() => Account, (account) => account.campus)
  accounts: Account[];

  @OneToMany(() => Gist, (gist) => gist.campus)
  gists: Gist[];
}
