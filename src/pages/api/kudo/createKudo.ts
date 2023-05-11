import { type NextApiRequest, type NextApiResponse } from "next";
import { makeSlackKudo } from "~/server/services/kudoService";
// import { openModal } from "~/server/services/slackService";
import { env } from "~/env.mjs";
import { WebClient, type FilesUploadResponse } from "@slack/web-api";

interface body {
  text: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  challenge: string;
  trigger_id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text: string = (req.body as body).text;
  const channel: string = (req.body as body).channel_id;

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  //Informatie over channel opvragen
  const channelInfoResponse = await slackClient.conversations.info({
    channel: channel,
  });

  if (!channelInfoResponse.ok) {
    res.status(200).json({
      success: true,
      message: "Something went wrong, this channel was not found.",
    });
  } else if (!channelInfoResponse.channel?.is_channel) {
    res.status(200).json({
      success: true,
      message:
        "Something went wrong, you can not send kudos in a private message, Sorry!",
    });
  } else {
    res.status(200).json({ success: true });
  }

  res.status(200).json({ success: true });
  const base64 = await makeSlackKudo(text);

  //Als bot geen lid is van channel, join de channel.
  if (!channelInfoResponse.channel?.is_member) {
    await slackClient.conversations.join({
      channel: channel,
    });
  }

  try {
    const uploadResponse: FilesUploadResponse = await slackClient.files.upload({
      channels: channel,
      file: Buffer.from(base64, "base64"),
      filename: "kudo.jpg",
      title: "Mooie kudo jonge",
    });
    console.log(uploadResponse);
  } catch (e) {
    console.log(e);
  }
  res.end();
}
