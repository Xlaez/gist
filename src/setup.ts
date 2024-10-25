import RedisStore from "connect-redis";
import expressSession from "express-session";
import { serverConfigs } from "./shared/configs/envs.config";
import { redisClient } from "./shared/configs/redis.config";
import { buildSchema } from "type-graphql";
import { AccountResolver } from "./components/account/resolvers/account.resolver";

export const session = expressSession({
  store: new RedisStore({ client: redisClient as any }),
  secret: serverConfigs.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: serverConfigs.env === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export const schema = async function createSchema() {
  return await buildSchema({
    resolvers: [AccountResolver],
  });
};
