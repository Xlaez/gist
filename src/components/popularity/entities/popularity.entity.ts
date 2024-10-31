import { Account } from "@/components/account/entities/account.entity";
import { Campus } from "@/components/campus/entities/campus.entity";
import { Gist } from "@/components/gist/entities/gist.entity";
import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Popularity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Number)
  @Column({ default: 0 })
  level: number;

  // relationships

  @Field(() => Account, { nullable: true })
  @OneToMany(() => Account, (account) => account.popularity)
  accounts?: Account[];

  @Field(() => Campus)
  @OneToMany(() => Campus, (campus) => campus.popularity)
  campus: Campus[];

  @Field(() => Gist, { nullable: true })
  @OneToMany(() => Gist, (gist) => gist.popularity)
  gists?: Gist[];
}
