import { Account } from "@/components/account/entities/account.entity";

export const setSession = (
  req: any,
  account: Partial<Account>,
  token: string
) => {
  req.session.user = account;
  req.session.token = token;
};
