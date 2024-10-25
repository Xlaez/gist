import { AccountService } from "../services/account.service";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Account } from "../entities/account.entity";
import { EmailInput } from "../inputs/create_account.input";
import { TryCatchAsyncDec } from "@dolphjs/dolph/common";

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
}
