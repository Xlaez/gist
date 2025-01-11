import { DolphFactory, middlewareRegistry } from "@dolphjs/dolph";
import { context, schema, session } from "./setup";
import { AppDataSource } from "./shared/configs/data_source";
import { logger } from "@dolphjs/dolph/utilities";

middlewareRegistry.register(session);

const dolph = new DolphFactory({ graphql: true, schema: schema(), context });

AppDataSource.initialize()
  .then(() => {
    dolph.start();
  })
  .catch((err) => logger.error(`[Dolph Error]:`, err));
