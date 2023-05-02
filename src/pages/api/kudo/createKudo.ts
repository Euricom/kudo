import { type NextApiRequest, type NextApiResponse } from "next";

interface body {
  text: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const text: string = (req.body as body).text;

  res.send({
    response_type: "in_channel",
    text: text,
  });
  res.end();
}
