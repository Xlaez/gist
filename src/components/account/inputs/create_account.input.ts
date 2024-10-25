import { IsEmail, IsString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class EmailInput {
  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;
}

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsString()
  @Length(4, 4, { message: "Otp cannot be less or more than 4 characters" })
  otp: string;

  @Field()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;
}

//   @IsString({ message: "Provide a valid account ID" })
// @Length(36, 36, { message: "provide a valid account ID" })
