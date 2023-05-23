import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { env } from "~/env.mjs";

type QueryContent = {
  code: string;
  state: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  const data = {
    client_id: env.clientId,
    client_secret: env.clientSecret,
    code: (req.query as QueryContent).code,
  };
  try {
    await slackClient.oauth.v2.access(data).then((res) => console.log(res));
  } catch (e) {
    console.log(e);
  }

  console.log(data);

  res.redirect("/slack_permissions_granted");
}
