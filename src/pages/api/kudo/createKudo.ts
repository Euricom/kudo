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
  const trigger_id: string = (req.body as body).trigger_id;

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);

  //Direct message werkt niet

  if (channel.startsWith("D")) {
    res
      .status(200)
      .json(
        "Something went wrong, you can not send kudos in a private message, Sorry!"
      );
  }

  //info over channel opvragen
  let channelInfoResponse;
  try {
    channelInfoResponse = await slackClient.conversations.info({
      channel: channel,
    });
  } catch (e) {
    res.status(200).json("Something went wrong, this channel was not found.");
    res.end();
  }

  if (!channelInfoResponse?.ok) {
    res.status(200).json("Something went wrong, this channel was not found.");
    res.end();
  } else if (!channelInfoResponse.channel?.is_channel) {
    res
      .status(200)
      .json(
        "Something went wrong, you can not send kudos in a private message, Sorry!"
      );
    res.end();
  }

  await slackClient.views.open({
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "modal-identifier",
      title: {
        type: "plain_text",
        text: "Just a modal",
      },
      blocks: [
        {
          type: "section",
          block_id: "section-identifier",
          text: {
            type: "mrkdwn",
            text: "*Welcome* to ~my~ Block Kit _modal_!",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Just a button",
            },
            action_id: "button-identifier",
          },
        },
      ],
    },
  });
  // await openModal(trigger_id);

  const base64 = await makeSlackKudo(text);

  //Als bot geen lid is van channel, join de channel.
  if (!channelInfoResponse?.channel?.is_member) {
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
