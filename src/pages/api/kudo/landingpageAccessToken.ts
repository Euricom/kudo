import {
  type OauthAccessResponse,
  WebClient,
  OauthV2AccessResponse,
} from "@slack/web-api";
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
  // try {
  //   await slackClient.oauth.v2
  //     .access(data)
  //     .then((response: OauthV2AccessResponse) => {
  //       console.log(response);
  //     });
  // } catch (e) {
  //   console.log(e);
  // }
  try {
    await slackClient.oauth.v2
      .access(data)
      .then(async (response: OauthV2AccessResponse) => {
        const access_token1 = response.access_token;
        const access_token2 = response.authed_user?.access_token;
        console.log(access_token1);
        console.log(access_token2);

        try {
          await prisma.user.update({
            where: {
              id: (req.query as QueryContent).state,
            },
            data: {
              access_token: access_token2,
            },
          });
        } catch (e) {
          console.log(e);
        }
      });
  } catch (e) {
    console.log(e);
  }

  console.log(data);

  res.redirect("/slack_permissions_granted");
}
