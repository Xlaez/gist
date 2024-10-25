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

  @Field(() => String)
  @Column({ unique: true, length: 255, type: "varchar" })
  name: string;

  @Field(() => String)
  @Column({ type: "text" })
  domain: string;

  @Field(() => String)
  @Column({ type: "text" })
  cover_img: string;

  @Field(() => String)
  @Column({ length: 255 })
  description: string;

  @Field(() => Boolean)
  @Column({ default: false })
  is_deleted: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  locked: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  is_banned: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
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
