import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { AppDataSource } from "@/shared/configs/data_source";

export class AccountService extends DolphServiceHandler<Dolph> {
  private readonly accountRepo: Repository<Account>;

  constructor() {
    super("accountService");
    this.accountRepo = AppDataSource.getRepository(Account);
  }

  async createAccount(data: Partial<Account>): Promise<Account> {
    const account = this.accountRepo.create(data);
    return this.accountRepo.save(account);
  }
}
