import { type NextApiRequest, type NextApiResponse } from "next";

interface body {
  message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const message: string = (req.body as body).message;

  res.send({
    response_type: "in_channel",
    text: message,
  });
  res.end();
}
