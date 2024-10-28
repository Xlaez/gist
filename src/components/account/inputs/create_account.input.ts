import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";
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

@InputType()
export class SetPasswordInput {
  @Field()
  @IsString()
  @Length(5, 30, {
    message:
      "Password cannot be less than 5 characters or more tha 30 characters",
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&,.\[\]^*])[A-Za-z\d@$!%?&,.\[\]^*]+/,

    {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%?&)",
    }
  )
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(4, 25, {
    message:
      "GistID cannot be less than 4 characters or more than 25 characters",
  })
  gist_id: string;

  @Field()
  @IsString({ message: "Provide a valid account ID" })
  @Length(36, 36, { message: "provide a valid account ID" })
  id: string;
}

@InputType()
export class SetBasicAccountDetailsInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  country: string;

  // @Field()
  // @IsString()
  // @IsNotEmpty()
  // campus: string;

  @Field()
  @Type(() => Date)
  dob: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field()
  @IsBoolean()
  two_factor_auth: boolean;
}
