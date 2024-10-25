import { DolphFactory, middlewareRegistry } from "@dolphjs/dolph";
import { schema, session } from "./setup";
import { AppDataSource } from "./shared/configs/data_source";
import { logger } from "@dolphjs/dolph/utilities";

middlewareRegistry.register(session);

const dolph = new DolphFactory({ graphql: true, schema: schema() });

AppDataSource.initialize()
  .then(() => {
    dolph.start();
  })
  .catch((err) => logger.error(`[App Error]:`, err));
