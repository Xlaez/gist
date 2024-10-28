import { serverConfigs } from "@/shared/configs/envs.config";
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { generateJWTwithHMAC } from "@dolphjs/dolph/utilities";
import { Response } from "express";
import moment from "moment";

export class TokenService extends DolphServiceHandler<Dolph> {
  constructor() {
    super("tokenService");
  }

  generateAuthToken(userId: string) {
    const tokenDuration =
      serverConfigs.env === "development"
        ? serverConfigs.jwt.devExpiration
        : serverConfigs.jwt.prodExpiration;

    const expiration = moment().add(Number(tokenDuration), "minutes");

    const token = generateJWTwithHMAC({
      payload: {
        sub: userId,
        exp: expiration.unix(),
        iat: moment().unix(),
      },
      secret: serverConfigs.jwt.secret,
    });

    return {
      token,
      expiration,
    };
  }

  sendAuthCookie(res: Response, token: string) {
    const cookieOption = {
      expires: moment()
        .add(
          Number(
            serverConfigs.env === "development"
              ? serverConfigs.jwt.devExpiration
              : serverConfigs.jwt.prodExpiration
          ),
          "minutes"
        )
        .toDate(),
      httpOnly: true,
      secure: false,
    };

    if (serverConfigs.env == "production") {
      cookieOption.secure = true;
    }

    res.cookie("AuthCookie", token, cookieOption);

    return res;
  }
}
