import { Field, ObjectType } from "type-graphql";
import { Account } from "../entities/account.entity";
import { Type } from "class-transformer";
import { IsBoolean } from "class-validator";

@ObjectType()
export class VerifyEmailResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class IsGistIdAvailableResponse {
  @Field()
  available: boolean;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class PasswordSignInResponse {
  @Field()
  @Type(() => Account)
  account: Account;

  @Field()
  @IsBoolean()
  otpSent: boolean;
}
