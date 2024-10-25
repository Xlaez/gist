import { Field, InputType } from "type-graphql";

@InputType()
export class PasswordSignUpInput {
  @Field()
  email: string;
}
