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
    text: text,
    image_url: image,
  });
  res.end();
}
