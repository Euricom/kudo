import axios from "axios";
import { env } from "~/env.mjs";

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
