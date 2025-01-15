import { IsIn, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
import { NotificationType } from "../notification.enums";

@InputType()
export class CreateNotificationInput {
  @Field({})
  @IsString()
  text: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  @IsIn([
    NotificationType.Account,
    NotificationType.Gist,
    NotificationType.General,
    NotificationType.Subscription,
  ])
  type: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id_of_type?: string;
}
