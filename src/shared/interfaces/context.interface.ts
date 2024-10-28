import { Account } from "@/components/account/entities/account.entity";
import { IncomingMessage, ServerResponse } from "http";

export interface IContext {
  req: IncomingMessage;
  res: ServerResponse;
  account?: Partial<Account>;
  cookies?: {
    [key: string]: string;
  };
  session?: {
    sessionId: string;
    token: string;
    [key: string]: any;
  };
}
