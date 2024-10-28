import { createMethodMiddlewareDecorator } from "type-graphql";
import {
  ForbiddenError,
  ServerError,
  UnAuthenticatedError,
} from "@dolphjs/graphql/common";
import { verifyJWTwithHMAC } from "@dolphjs/dolph/utilities";
import { IPayload } from "@dolphjs/dolph/common";
import { TokenService } from "@/components/account/services/token.service";
import { serverConfigs } from "../configs/envs.config";

const tokenService = new TokenService();

export function Authenticated() {
  return createMethodMiddlewareDecorator(
    async ({ context }: { context: any }, next) => {
      const { req }: { req?: any } = context;

      const EXPIRATION_THRESHOLD = 60 * 5;

      const session = req.session;

      if (session) {
        const token = session.token;

        if (!token)
          throw new UnAuthenticatedError("Account is not authenticated.");

        if (session.user?.is_deleted)
          throw new ForbiddenError("A deleted account cannot access this app.");

        const decode = verifyJWTwithHMAC({
          token,
          secret: serverConfigs.jwt.secret,
        }) as IPayload;

        const currentTime = Math.floor(Date.now() / 1000);

        if (decode.exp && decode.exp - currentTime < EXPIRATION_THRESHOLD) {
          const token = tokenService.generateAuthToken(session.user.id);

          if (!token) throw new ServerError("Cannot refresh auth token");

          session.token = token;
        }
      }

      const account = session.user ? session.user : {};

      context.account = account;

      return next();
    }
  );
}
