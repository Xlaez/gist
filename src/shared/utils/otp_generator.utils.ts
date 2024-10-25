import { randomBytes } from "crypto";

export const generateOtp = () => {
  let result = "";

  for (let i = 0; i < 4; i++) {
    const tempNum =
      (randomBytes(4).readUint32BE() / 0xffffffff) * (9 - 0 + 1) + 0;

    result += Math.floor(tempNum % 10).toString();
  }

  return result;
};
