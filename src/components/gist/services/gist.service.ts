import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { CreateGistInput } from "../inputs/gist.inputs";
import { Account } from "@/components/account/entities/account.entity";
import { Repository } from "typeorm";
import { Gist } from "../entities/gist.entity";
import { Popularity } from "@/components/popularity/entities/popularity.entity";
import { Media } from "../entities/media.entity";
import { AppDataSource } from "@/shared/configs/data_source";
import { CampusService } from "@/components/campus/services/campus.service";
import { NotFoundError } from "@dolphjs/graphql/common";

export class GistService extends DolphServiceHandler<Dolph> {
  private readonly gistRepo: Repository<Gist>;
  private readonly popularityRepo: Repository<Popularity>;
  private readonly mediaRepo: Repository<Media>;
  private readonly campusService: CampusService;

  constructor() {
    super("gistService");
    this.gistRepo = AppDataSource.getRepository(Gist);
    this.popularityRepo = AppDataSource.getRepository(Popularity);
    this.mediaRepo = AppDataSource.getRepository(Media);
    this.campusService = new CampusService();
  }

  async createGist(data: CreateGistInput, account: Partial<Account>) {
    const campus = await this.campusService.getCampusByAccountID(account.id);

    if (!campus) throw new NotFoundError("Campus not found");

    let gistObj: Partial<Gist> = {
      account: account as Account,
      campus: campus,
      is_public: data.is_public,
      tags: data.tags,
      type: data.type,
      text: data.text,
    };

    if (data.parent_id) {
      Object.assign(
        gistObj,
        { ...gistObj },
        { has_parent: true, parent_id: data.parent_id }
      );
    }

    const createdGist = this.gistRepo.create(gistObj);

    const savedGist = await this.gistRepo.save(createdGist);

    if (data.media) {
      for (const media of data.media) {
        const createdMedia = this.mediaRepo.create({
          media_type: media.media_type,
          media_url: media.media_url,
          gist: savedGist,
        });

        const savedMedia = await this.mediaRepo.save(createdMedia);

        savedGist.media = [];
        savedGist.media.push(savedMedia);
      }
    }

    const popularity = this.popularityRepo.create({
      gists: [savedGist],
      campus: [campus],
    });

    await this.popularityRepo.save(popularity);

    const returnedGists = await this.gistRepo.findOne({
      where: { id: savedGist.id },
      relations: ["media", "popularity", "campus"],
    });

    return returnedGists;
    /**
     * Todo: broadcast notification to all accounts in a campus that a gist has dropped
     */
  }

  /**
   * Todo: when likes are added, load the likes and views too
   */
  async fetchGist(gist_id: string) {
    const gists: Gist[] = [];

    let currentGist = await this.gistRepo.findOne({
      where: { id: gist_id },
      relations: ["campus", "popularity", "media"],
    });

    while (currentGist) {
      gists.push(currentGist);
      if (!currentGist.has_parent) break;

      currentGist = await this.gistRepo.findOne({
        where: { id: currentGist.parent_id },
        relations: ["campus", "popularity", "media"],
      });
    }

    console.log(gists);

    return gists;
  }
}
