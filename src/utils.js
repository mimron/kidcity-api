import crypto from "crypto";

export const encrypt = (val) => {
  const hmac = crypto
    .createHmac("sha256", process.env.TRI_SHARED_KEY)
    .update(val)
    .digest("hex");
  return hmac;
};
