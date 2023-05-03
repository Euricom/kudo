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
