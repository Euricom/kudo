import { env } from "~/env.mjs";
import { prisma } from "../db";
import { WebClient } from "@slack/web-api";

export const updateUserWithAccessToken = async (
  code: string,
  userId: string
) => {
  console.log(env.clientId);
  console.log(env.clientSecret);
  console.log(code);

  const formData = new FormData();
  formData.append("client_id", env.clientId);
  formData.append("client_secret", env.clientSecret);
  formData.append("code", code);
  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  const data = {
    client_id: env.clientId,
    client_secret: env.clientSecret,
    code: code,
  };
  try {
    await slackClient.oauth.v2.access(data);
  } catch (e) {
    console.log(e);
  }
  //   console.log(res);

  const url = "https://slack.com/api/oauth.v2.access";
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data).toString(),
  })
    .then((res) => res.json())
    .then((res) => console.log(res));

  await fetch(url, {
    method: "POST",
    body: formData,
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
