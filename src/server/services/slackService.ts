import axios from "axios";
import { env } from "~/env.mjs";

interface SlackResponse {
  ok: boolean;
  channel: Channel;
}

interface Channel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_private: boolean;
  user: string;
}

export async function getChannelById(id: string) {
  const url = "https://slack.com/api/conversations.info";
  const token = env.SLACK_APP_TOKEN;

  const body = new URLSearchParams({
    channel: id,
  });

  const response = (await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: body,
  }).then((res) => res.json())) as SlackResponse;

  return response.channel;
}

export async function openModal(triggerId: string) {
  const url = "https://slack.com/api/views.open";
  const token = env.SLACK_APP_TOKEN;

  const body = {
    trigger_id: triggerId,
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
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(url, body, config);

  // const response = (await fetch(url, {
  //   method: "POST",
  //   headers: ,
  //   body: body,
  // }).then((res) => res.json())) as SlackResponse;

  return response;
}

export async function writeFile(base64: string, channel: string) {
  console.log(channel);

  const url = "https://slack.com/api/files.upload";
  const token = env.SLACK_APP_TOKEN;

  const body = new URLSearchParams({
    channel: channel,
    file: base64,
  });

  const response = (await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: body,
  }).then((res) => res.json())) as SlackResponse;
  return response;
}
