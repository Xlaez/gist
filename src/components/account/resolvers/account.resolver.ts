import { AccountService } from "../services/account.service";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Account } from "../entities/account.entity";
import {
  EmailInput,
  SetPasswordInput,
  VerifyOtpInput,
} from "../inputs/create_account.input";
import { TryCatchAsyncDec } from "@dolphjs/dolph/common";
import {
  IsGistIdAvailableResponse,
  VerifyEmailResponse,
} from "../responses/create_account.response";

@Resolver(() => Account)
export class AccountResolver {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  @Query(() => Account, { nullable: true })
  async getAccountByGistID(
    @Arg("id", () => String) id: string
  ): Promise<Account | undefined> {
    return;
  }

  @Query(() => IsGistIdAvailableResponse)
  async isGistIdAvailable(
    @Arg("gist_id", () => String) gist_id: string
  ): Promise<IsGistIdAvailableResponse> {
    try {
      return this.accountService.isGistIdAvailable(gist_id);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Account)
  async createAccount(
    @Arg("data", () => EmailInput) data: EmailInput
  ): Promise<Account> {
    try {
      return this.accountService.createAccount(data);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(
    @Arg("data", () => VerifyOtpInput) data: VerifyOtpInput
  ): Promise<VerifyEmailResponse> {
    try {
      const success = await this.accountService.verifyOtp(data);
      return { success, message: "Email verified successfully" };
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Account)
  async resendVerifyEmailOtp(
    @Arg("data", () => EmailInput) data: EmailInput
  ): Promise<Account> {
    try {
      return this.accountService.resendOtp(data);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Account)
  async setPasswordAndID(
    @Arg("data", () => SetPasswordInput) data: SetPasswordInput
  ): Promise<Account> {
    try {
      return this.accountService.setPassword(data);
    } catch (e: any) {
      throw e;
    }
  }
}
