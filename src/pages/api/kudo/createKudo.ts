import { type NextApiRequest, type NextApiResponse } from "next";
import {
  getFirstImageById,
  makeSlackKudo,
} from "~/server/services/kudoService";

interface body {
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text: string = (req.body as body).text;
  // const image = await getFirstImageById().then((i) => i?.dataUrl);
  console.log("test1");
  const image = await makeSlackKudo(text);
  console.log("test1");

  res.send({
    response_type: "in_channel",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Mooie kudo jonge",
        },
      },
      {
        type: "section",
        accessory: {
          type: "image",
          image_url: image,
          alt_text: "Kudo",
        },
      },
    ],
  });
  res.end();
}
