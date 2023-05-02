import { type NextApiRequest, type NextApiResponse } from "next";
import { getFirstImageById } from "~/server/services/kudoService";

interface body {
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text: string = (req.body as body).text;
  const image = await getFirstImageById().then((i) => i?.dataUrl);
  res.send({
    response_type: "in_channel",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "New request",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Type:*\nPaid Time Off",
          },
          {
            type: "mrkdwn",
            text: "*Created by:*\n<example.com|Fred Enriquez>",
          },
        ],
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*When:*\nAug 10 - Aug 13",
          },
        ],
        accessory: {
          type: "image",
          image_url: image,
          alt_text: "Haunted hotel image",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "<https://example.com|View request>",
        },
      },
    ],
  });
  res.end();
}
