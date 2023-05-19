import { env } from "~/env.mjs";
import { prisma } from "../db";

export const updateUserWithAccessToken = async (
  code: string,
  userId: string
) => {
  const data = {
    client_id: env.clientId,
    client_secret: env.clientSecret,
    code: code,
  };
  const url = "https://slack.com/api/oauth.v2.access";
  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      data,
    }),
  })
    .then((res) => res.json())
    .then(async (response: { access_token: string }) => {
      const access_token = response.access_token;
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          access_token: access_token,
        },
      });
    });
};
