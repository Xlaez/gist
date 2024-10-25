import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class VerifyEmailResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
