import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import {
  BadRequestException,
  Dolph,
  NotFoundException,
} from "@dolphjs/dolph/common";
import { Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { AppDataSource } from "@/shared/configs/data_source";
import { AuthenticationError } from "type-graphql";
import { CacheService } from "@/shared/services/cache_manager.service";
import { generateOtp } from "@/shared/utils/otp_generator.utils";
import { sendVerifyEmail } from "@/shared/services/mail.service";
import { VerifyOtpInput } from "../inputs/create_account.input";

export class AccountService extends DolphServiceHandler<Dolph> {
  private readonly accountRepo: Repository<Account>;
  private readonly cacheService: CacheService;

  constructor() {
    super("accountService");
    this.accountRepo = AppDataSource.getRepository(Account);
    this.cacheService = new CacheService();
  }

  async createAccount(data: Partial<Account>): Promise<Account> {
    const existingAccount = await this.getAccountByEmail(data.email);

    try {
      if (existingAccount)
        throw new AuthenticationError(
          "An account with this email already exists."
        );

      const account = this.accountRepo.create(data);

      const otp = generateOtp();

      await this.cacheService.remove([`0-${data.email}`]);

      await this.cacheService.save(`0-${data.email}`, otp, 3600);

      account.login_type = "password";

      sendVerifyEmail(data.email, otp);

      return this.accountRepo.save(account);
    } catch (e: any) {
      throw e;
    }
  }

  async verifyOtp(data: VerifyOtpInput): Promise<boolean> {
    try {
      const otp = await this.cacheService.get(`0-${data.email}`);

      if (!otp)
        throw new AuthenticationError(
          "Otp has either expired or is incorrect."
        );

      await this.cacheService.remove([`0-${data.email}`]);

      if (otp === data.otp) return true;

      throw new AuthenticationError("Otp Incorrect. Provide the correct Otp");
    } catch (e: any) {
      throw e;
    }
  }

  async resendOtp(data: Partial<Account>): Promise<Account> {
    try {
      const existingAccount = await this.getAccountByEmail(data.email);

      if (!existingAccount)
        throw new NotFoundException("Account does not exist");

      if (existingAccount.is_verified)
        throw new BadRequestException("Account is already verified");

      const otp = generateOtp();

      await this.cacheService.remove([`0-${data.email}`]);

      await this.cacheService.save(`0-${data.email}`, otp, 3600);

      //  use another email function
      sendVerifyEmail(data.email, otp);

      return existingAccount;
    } catch (e) {
      throw e;
    }
  }

  async getAccountByEmail(email: string): Promise<Account | null | undefined> {
    return this.accountRepo.findOne({ where: { email } });
  }
}
