import { WebClient, type OauthV2AccessResponse } from "@slack/web-api";
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

  try {
    await slackClient.oauth.v2
      .access(data)
      .then(async (response: OauthV2AccessResponse) => {
        const access_token = response.authed_user?.access_token;
        try {
          await prisma.user.update({
            where: {
              id: (req.query as QueryContent).state,
            },
            data: {
              access_token: access_token,
            },
          });
        } catch (e) {
          console.error(e);
        }
      });
  } catch (e) {
    console.error(e);
  }

  res.redirect("/slack_permissions_granted");
}
