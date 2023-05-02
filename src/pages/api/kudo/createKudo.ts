import { type NextApiRequest, type NextApiResponse } from "next";
import { getFirstImageById } from "~/server/services/kudoService";

interface body {
  text: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const text: string = (req.body as body).text;
  const image = getFirstImageById().then((i) => i?.dataUrl);
  res.send({
    response_type: "in_channel",
    text: image,
  });
  res.end();
}
