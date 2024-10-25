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

  @Field(() => String, { defaultValue: "meh" })
  @Column({ unique: true, default: "meh" })
  level: string;

  // relationships

  @OneToMany(() => Account, (account) => account.popularity)
  accounts: Account[];

  @OneToMany(() => Campus, (campus) => campus.popularity)
  campuses: Campus[];

  @OneToMany(() => Gist, (gist) => gist.popularity)
  gists: Gist[];
}
