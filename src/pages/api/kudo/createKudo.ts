import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("erin");

  res.send({});
  // res.send({
  //   response_type: "in_channel",
  //   text: "...",
  // });
  res.end();
}
