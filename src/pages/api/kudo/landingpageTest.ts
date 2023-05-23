import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

type body = {
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
    code: (req.body as body).code,
  };
  try {
    await slackClient.oauth.v2.access(data);
  } catch (e) {
    console.log(e);
  }

  console.log(data);
}
