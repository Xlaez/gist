import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Gist } from "./gist.entity";

@ObjectType()
@Entity()
@Index("media_index_0", ["gist", "id"])
export class Media {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Gist)
  @ManyToOne(() => Gist, (gist) => gist.media)
  @JoinColumn({ name: "gist_id" })
  gist: typeof Gist;

  @Field(() => String)
  @Column({ length: 15 })
  media_type: string;

  @Field(() => String)
  @Column({ type: "text" })
  media_url: string;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
