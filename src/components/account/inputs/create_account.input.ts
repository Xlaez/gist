import { IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class EmailInput {
  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;
}
