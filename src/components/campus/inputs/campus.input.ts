import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCampusInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  domain: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cover_img: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;
}
