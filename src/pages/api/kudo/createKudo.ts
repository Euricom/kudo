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
          image_url:
            "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
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
