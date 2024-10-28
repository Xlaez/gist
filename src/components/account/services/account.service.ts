import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { AppDataSource } from "@/shared/configs/data_source";
import { AuthenticationError } from "type-graphql";
import { CacheService } from "@/shared/services/cache_manager.service";
import { generateOtp } from "@/shared/utils/otp_generator.utils";
import { sendVerifyEmail } from "@/shared/services/mail.service";
import {
  LoginWithEmailInput,
  VerifyOtpInput,
} from "../inputs/create_account.input";
import {
  compareWithBcryptHash,
  hashWithBcrypt,
} from "@dolphjs/dolph/utilities";
import { IsGistIdAvailableResponse } from "../responses/create_account.response";
import {
  NotFoundError,
  NotAllowedError,
  BadRequestError,
  ServerError,
  ForbiddenError,
} from "@dolphjs/graphql/common";

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

      await this.accountRepo.update(
        { email: data.email },
        { is_verified: true }
      );

      if (otp === data.otp) return true;

      throw new AuthenticationError("Otp Incorrect. Provide the correct Otp");
    } catch (e: any) {
      throw e;
    }
  }

  async resendOtp(data: Partial<Account>): Promise<Account> {
    try {
      const existingAccount = await this.getAccountByEmail(data.email);

      if (!existingAccount) throw new NotFoundError("Account does not exist");

      if (existingAccount.is_verified)
        throw new BadRequestError("Account is already verified");

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

  async isGistIdAvailable(gist_id: string): Promise<IsGistIdAvailableResponse> {
    try {
      if (await this.getAccountByGistID(gist_id))
        return {
          available: false,
          message: "This gist_id belongs to another user",
        };

      return {
        available: true,
      };
    } catch (e: any) {
      throw e;
    }
  }

  async setPassword(data: Partial<Account>): Promise<Account> {
    try {
      const account = await this.getAccountByID(data.id);

      if (!account) throw new NotFoundError("Account does not exist");

      if (!account.is_verified)
        throw new NotAllowedError("Account not verified");

      if (account.password) throw new NotAllowedError("Password already set");

      await this.accountRepo.update(
        { id: account.id },
        {
          password: await hashWithBcrypt({
            pureString: data.password,
            salt: 11,
          }),
          gist_id: data.gist_id,
        }
      );

      return account;
    } catch (e: any) {
      throw e;
    }
  }

  async setBasicAccountDetails(
    data: Partial<Account>,
    id: string
  ): Promise<Account | undefined> {
    let account = await this.accountRepo.findOne({ where: { id } });

    if (!account) throw new NotFoundError("Cannot find this account.");

    account.avatar = data.avatar;
    account.bio = data.bio;
    // account.campus = data.campus;
    account.country = data.country;
    account.two_factor_auth = data.two_factor_auth;
    account.dob = data.dob;

    return await this.accountRepo.save(account);
  }

  async loginWithPassword(data: LoginWithEmailInput): Promise<Account> {
    try {
      const account = await this.accountRepo.findOne({
        where: [{ email: data.emailOrID }, { gist_id: data.emailOrID }],
      });

      if (!account) throw new BadRequestError("Incorrect login credentials");

      if (account.is_banned)
        throw new ForbiddenError(
          "Account has been banned from accessing our servers."
        );

      if (account.is_deactivated)
        throw new ForbiddenError(
          "Account has been deactivated, visit the deactivation page to kow more"
        );

      if (!account.is_verified)
        throw new NotAllowedError(
          "Verify your account first in order to login"
        );

      if (
        !compareWithBcryptHash({
          pureString: data.password,
          hashString: account.password,
        })
      ) {
        throw new BadRequestError("Incorrect login credentials");
      }

      /**
       * Todo: save device tokens here and check ip_address to send user otp i
       */

      if (!account.two_factor_auth) return account;

      // send otp here
    } catch (e: any) {
      throw new ServerError(e?.message ? e.message : e);
    }
  }

  async getAccountByID(id: string): Promise<Account | null | undefined> {
    return this.accountRepo.findOne({ where: { id } });
  }

  async getAccountByEmail(email: string): Promise<Account | null | undefined> {
    return this.accountRepo.findOne({ where: { email } });
  }

  async getAccountByGistID(
    gist_id: string
  ): Promise<Account | null | undefined> {
    return this.accountRepo.findOne({ where: { gist_id } });
  }
}
