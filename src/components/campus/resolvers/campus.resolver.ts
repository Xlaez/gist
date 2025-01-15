import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Campus } from "../entities/campus.entity";
import { CampusService } from "../services/campus.service";
import { Authenticated } from "@/shared/decorators/authentication.decorator";
import { CreateCampusInput } from "../inputs/campus.input";
import { IContext } from "@/shared/interfaces/context.interface";
import { NotFoundError } from "@dolphjs/graphql/common";

@Resolver(() => Campus)
export class CampusResolver {
  private readonly campusService: CampusService;

  constructor() {
    this.campusService = new CampusService();
  }

  @Mutation(() => Campus)
  @Authenticated()
  async createCampus(
    @Arg("data", () => CreateCampusInput) data: CreateCampusInput,
    @Ctx() ctx: IContext
  ): Promise<Campus> {
    try {
      return this.campusService.createCampus(data, ctx.account.id, ctx.account);
    } catch (e: any) {
      throw e;
    }
  }

  @Query(() => Campus)
  @Authenticated()
  async getCampus(
    @Arg("campus_id", () => String) campus_id: string
  ): Promise<Campus> {
    try {
      const campus = await this.campusService.getCampusByNameDomainOrID(
        campus_id
      );

      if (!campus) throw new NotFoundError("Campus does not exist.");

      return campus;
    } catch (e: any) {
      throw e;
    }
  }

  @Mutation(() => Campus)
  @Authenticated()
  async deleteCampus(
    @Arg("campus_id", () => String) campus_id: string,
    @Ctx() ctx: IContext
  ): Promise<Campus> {
    try {
      return this.campusService.deleteCampus(campus_id, ctx.account);
    } catch (e: any) {
      throw e;
    }
  }
}
