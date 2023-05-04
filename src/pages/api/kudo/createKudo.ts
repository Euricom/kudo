import { type NextApiRequest, type NextApiResponse } from "next";
import { getFirstImageById } from "~/server/services/kudoService";
import { getChannelById } from "~/server/services/slackService";

interface body {
  text: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  challenge: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: body = req.body as body;
  const channel = await getChannelById(body.channel_id);

  const text =
    "is het im? " +
    channel.is_im.toString() +
    ", Name: " +
    channel.name +
    ", user=" +
    channel.user +
    "channelId=" +
    body.channel_id +
    ", chanelName=" +
    body.channel_name +
    ", userId=" +
    body.user_id +
    ", userName=" +
    body.user_name;
  const image = await getFirstImageById().then((i) => i?.dataUrl);

  res.send({
    channel: channel,
  });
  res.end();
}
