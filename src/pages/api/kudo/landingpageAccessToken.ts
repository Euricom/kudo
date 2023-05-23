import { type OauthAccessResponse, WebClient } from "@slack/web-api";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

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
  console.log("dit zou het id moeten zijn");
  console.log((req.query as QueryContent).state);
  try {
    await slackClient.oauth.v2
      .access(data)
      .then(async (response: OauthAccessResponse) => {
        const access_token = response.access_token;
        await prisma.user.update({
          where: {
            id: (req.query as QueryContent).state,
          },
          data: {
            access_token: access_token,
          },
        });
      });
  } catch (e) {
    console.log(e);
  }

  console.log(data);

  res.redirect("/slack_permissions_granted");
}
