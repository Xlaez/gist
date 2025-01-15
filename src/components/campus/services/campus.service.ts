import { CacheService } from "@/shared/services/cache_manager.service";
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { Repository } from "typeorm";
import { Campus } from "../entities/campus.entity";
import { AppDataSource } from "@/shared/configs/data_source";
import { Moderator } from "../entities/moderator.entity";
import { Account } from "@/components/account/entities/account.entity";
import {
  ForbiddenError,
  NotAllowedError,
  NotFoundError,
  ServerError,
} from "@dolphjs/graphql/common";

export class CampusService extends DolphServiceHandler<Dolph> {
  private readonly cacheService: CacheService;
  private readonly campusRepo: Repository<Campus>;
  private readonly moderatorRepo: Repository<Moderator>;

  constructor() {
    super("campusService");

    this.cacheService = new CacheService();
    this.campusRepo = AppDataSource.getRepository(Campus);
    this.moderatorRepo = AppDataSource.getRepository(Moderator);
  }

  async createCampus(
    data: Partial<Campus>,
    accountId: string,
    account: Partial<Account>
  ): Promise<Campus> {
    try {
      const existingCampus = await this.campusRepo.findOne({
        where: [
          { domain: data.domain },
          { name: data.name },
          { is_deleted: false },
        ],
      });

      if (existingCampus) {
        if (existingCampus.name === data.name)
          throw new NotAllowedError("A campus with this name already exist.");

        if (existingCampus.domain === data.domain)
          throw new NotAllowedError("A campus with this domain already exist.");
      }

      const campus = this.campusRepo.create({ ...data });

      campus.accounts = [account as Account];

      const newCampus = await this.campusRepo.save(campus);

      const moderator = this.moderatorRepo.create({
        account: { id: accountId },
        campus: newCampus,
      });

      await this.moderatorRepo.save(moderator);

      newCampus.moderators = [moderator];
      await this.campusRepo.save(newCampus);

      const returnCampus = await this.campusRepo.findOne({
        where: { id: newCampus.id },
        relations: ["moderators", "moderators.account"],
      });

      return returnCampus;
    } catch (e: any) {
      throw new ServerError(e);
    }
  }

  async getCampusByNameDomainOrID(keyword: string): Promise<Campus> {
    return this.campusRepo.findOne({
      where: [{ name: keyword }, { domain: keyword }],
      relations: ["moderators", "moderators.account"],
    });
  }

  async getCampusByID(id: string): Promise<Campus | null> {
    return this.campusRepo.findOne({
      where: { id, is_deleted: false },
      relations: ["moderators", "moderators.account"],
    });
  }

  async getCampusByAccountID(id: string): Promise<Campus | null> {
    return this.campusRepo.findOne({
      where: { accounts: { id }, is_deleted: false },
    });
  }

  async deleteCampus(id: string, account: Partial<Account>): Promise<Campus> {
    let campus = await this.campusRepo.findOne({
      where: { id, is_deleted: false },
      relations: ["moderators"],
    });

    let isModerator = false;

    for (let i = 0; i < campus.moderators.length; i++) {
      if (campus.moderators[i].account.id == account.id) {
        isModerator = true;
        break;
      }
    }

    /**
     * Todo: make it a delete request so that the moderators vote and if 3/4 approve it gets deleted
     */
    if (!isModerator)
      throw new ForbiddenError(
        "You cannot delete a campus you are not a moderator of"
      );

    if (!campus) throw new NotFoundError("Campus not found");

    campus.is_deleted = true;

    campus = await this.campusRepo.save(campus);

    return campus;
  }
}
