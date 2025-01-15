import { GistService } from "../services/gist.service";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Gist } from "../entities/gist.entity";
import { CreateGistInput, UpdateGistInput } from "../inputs/gist.inputs";
import { IContext } from "@/shared/interfaces/context.interface";
import { Authenticated } from "@/shared/decorators/authentication.decorator";

@Resolver(() => Gist)
export class GistResolver {
  private readonly gistService: GistService;

  constructor() {
    this.gistService = new GistService();
  }

  @Mutation(() => Gist)
  @Authenticated()
  async createGist(
    @Arg("data", () => CreateGistInput) data: CreateGistInput,
    @Ctx() ctx: IContext
  ): Promise<Gist> {
    try {
      return this.gistService.createGist(data, ctx.account);
    } catch (e: any) {
      throw e;
    }
  }

  @Query(() => [Gist])
  @Authenticated()
  async fetchGistWithParent(
    @Arg("gist_id", () => String) gist_id: string,
    @Ctx() ctx: IContext
  ): Promise<Gist[]> {
    try {
      return this.gistService.fetchGist(gist_id);
    } catch (e: any) {
      throw e;
    }
  }

  @Query(() => Gist)
  @Authenticated()
  async fetchGist(
    @Arg("gist_id", () => String) gist_id: string,
    @Ctx() ctx: IContext
  ): Promise<Gist> {
    try {
      return this.gistService.festGistID(gist_id);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Gist)
  @Authenticated()
  async updateGist(
    @Arg("data", () => UpdateGistInput) data: UpdateGistInput,
    @Ctx() ctx: IContext
  ): Promise<Gist> {
    try {
      return this.gistService.updateGist(data.gist_id, data, ctx.account);
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Gist)
  @Authenticated()
  async deleteGist(
    @Arg("gist_id", () => String) gist_id: string,
    @Ctx() ctx: IContext
  ) {
    try {
      return this.gistService.deleteGist(gist_id, ctx.account);
    } catch (e: any) {
      throw e;
    }
  }
}
