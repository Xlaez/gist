import { AccountService } from "../services/account.service";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Account } from "../entities/account.entity";
import { PasswordSignUpInput } from "../inputs/create_account.input";

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
  async passwordSignUp(
    @Arg("data", () => PasswordSignUpInput) data: PasswordSignUpInput
  ): Promise<Account> {
    return this.accountService.createAccount(data);
  }
}
