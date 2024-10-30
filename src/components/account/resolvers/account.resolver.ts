import { AccountService } from "../services/account.service";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Account } from "../entities/account.entity";
import {
  EmailInput,
  LoginWithEmailInput,
  SetBasicAccountDetailsInput,
  SetPasswordInput,
  VerifyOtpInput,
} from "../inputs/create_account.input";
import { TryCatchAsyncDec } from "@dolphjs/dolph/common";
import {
  IsGistIdAvailableResponse,
  VerifyEmailResponse,
} from "../responses/create_account.response";
import { IContext } from "@/shared/interfaces/context.interface";
import { TokenService } from "../services/token.service";
import { setSession } from "@/shared/utils/session.utils";
import { Authenticated } from "@/shared/decorators/authentication.decorator";

@Resolver(() => Account)
export class AccountResolver {
  private accountService: AccountService;
  private tokenService: TokenService;

  constructor() {
    this.accountService = new AccountService();
    this.tokenService = new TokenService();
  }

  @Query(() => Account, { nullable: true })
  @Authenticated()
  async getMyProfile(@Ctx() ctx: IContext): Promise<Account | undefined> {
    return this.accountService.getAccountByID(ctx.account.id);
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
    @Arg("data", () => SetPasswordInput) data: SetPasswordInput,
    @Ctx() ctx: IContext
  ): Promise<Account> {
    try {
      const account = await this.accountService.setPassword(data);

      const { token } = this.tokenService.generateAuthToken(account.id);

      setSession(ctx.req, account, token);

      return account;
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Account)
  @Authenticated()
  async setBasicAccountDetails(
    @Arg("data", () => SetBasicAccountDetailsInput)
    data: SetBasicAccountDetailsInput,
    @Ctx() ctx: IContext
  ): Promise<Account> {
    try {
      const { res, req, account } = ctx;

      const updatedAccount = await this.accountService.setBasicAccountDetails(
        data as any,
        account.id
      );

      const { token } = this.tokenService.generateAuthToken(account.id);

      this.tokenService.sendAuthCookie(res as any, token);

      setSession(req, updatedAccount, token);
      return updatedAccount;
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Account)
  async passwordSignIn(
    @Arg("data", () => LoginWithEmailInput) data: LoginWithEmailInput,
    @Ctx() ctx: IContext
  ): Promise<Account> {
    try {
      const account = await this.accountService.loginWithPassword(data);

      const { token } = this.tokenService.generateAuthToken(account.id);

      this.tokenService.sendAuthCookie(ctx.res as any, token);

      setSession(ctx.req, account, token);

      return account;
    } catch (e: any) {
      throw e;
    }
  }
}
