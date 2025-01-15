import { IsArray, IsBoolean, IsIn, IsString, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { GistType } from "../enums";
import { Type } from "class-transformer";

@InputType()
export class MediaData {
  @Field()
  @IsString()
  media_url: string;

  @Field()
  @IsString()
  media_type: string;
}

@InputType()
export class CreateGistInput {
  @Field({ nullable: true })
  @IsString()
  @Length(1, 300, { message: "A gist cannot be more than 300 characters" })
  text?: string;

  @Field()
  @IsBoolean()
  is_public: boolean;

  @Field()
  @IsString()
  @IsIn([GistType.gist, GistType.update])
  type: string;

  @Field(() => [String])
  @IsArray()
  tags: string[];

  @Field({ nullable: true })
  @IsString()
  parent_id?: string;

  @Field(() => [MediaData], { nullable: true })
  @Type(() => MediaData)
  @IsArray()
  media?: MediaData[];
}

@InputType()
export class UpdateGistInput {
  @Field({ nullable: true })
  @IsString()
  @Length(1, 300, { message: "A gist cannot be more than 300 characters" })
  text?: string;

  @Field()
  @IsBoolean()
  is_public: boolean;

  @Field()
  @IsString()
  gist_id: string;
}
