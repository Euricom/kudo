import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.query;

  res.send({
    response_type: "in_channel",
    text: message,
  });
  res.end();
}
