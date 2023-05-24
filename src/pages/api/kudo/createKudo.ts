import { type NextApiRequest, type NextApiResponse } from "next";
import {
  getAllTemplates,
  getChosenTemplate,
  makeSlackKudo,
} from "~/server/services/kudoService";
import { env } from "~/env.mjs";
import { WebClient, type PlainTextOption, type Block } from "@slack/web-api";
import { findUserByNameForSlack } from "~/server/services/userService";

interface Payload {
  type: string;
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  api_app_id: string;
  token: string;
  container: { type: string; view_id: string };
  trigger_id: string;
  team: { id: string; domain: string };
  enterprise: string;
  is_enterprise_install: boolean;
  view: {
    id: string;
    team_id: string;
    type: string;
    blocks: Block[];
    private_metadata: string;
    callback_id: string;
    state: {
      values: {
        [blockId: string]: {
          [actionId: string]: {
            type: string;
            selected_option: {
              text: { type: string; text: string; emoji: boolean };
              value: string;
            };
            text: { type: string; text: string; emoji: boolean };
            value: string;
          };
        };
      };
    };
    hash: string;
    title: { type: string; text: string; emoji: boolean };
    clear_on_close: boolean;
    notify_on_close: boolean;
    close: string;
    submit: { type: string; text: string; emoji: boolean };
    previous_view_id: string;
    root_view_id: string;
    app_id: string;
    external_id: string;
    app_installed_team_id: string;
    bot_id: string;
  };
  actions: [
    {
      type: string;
      action_id: string;
      block_id: string;
      selected_option: {
        text: { type: string; text: string; emoji: boolean };
        value: string;
      };
      placeholder: {
        type: string;
        text: string;
        emoji: boolean;
      };
      action_ts: string;
    }
  ];
}

interface body {
  text: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  challenge: string;
  trigger_id: string;
  payload?: string;
}

interface Content {
  type: number;
  id: string;
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const payloadString = (req.body as body).payload;
  if (payloadString) {
    const payload: Payload = JSON.parse(payloadString) as Payload;
    if (payload.type === "block_actions") {
      await sendSecondModal(payload);
    }
    if (payload.type === "view_submission") {
      await sendSecondModal(payload);

      console.log("ervoor!");
      await sendKudo(payload);
      console.log("erna!");
      res.send({
        response_action: "clear",
      });
      res.end();
    }
  }
  const channel: string = (req.body as body).channel_id;
  const trigger_id: string = (req.body as body).trigger_id;
  const userName = (req.body as body).user_name;

  if (userName) {
    const user = await findUserByNameForSlack(userName.replace(".", " "));

    console.log(user?.id);
    if (!user) {
      res.send("er ging iets fout");
      res.end();
    } else if (user && !user.access_token) {
      await sendAuthenticationModal(trigger_id, user?.id ?? "");
      res.end();
    } else if (user?.access_token) {
      await sendFirstModal(trigger_id, channel);
      res.end();
    }
  }

  res.end();
}
const sendSecondModal = async (payload: Payload) => {
  const templates = getAllTemplates();

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  const names: PlainTextOption[] = (await templates).map((t) => {
    return {
      text: { type: "plain_text", text: t.name },
      value: t.name,
    };
  });
  const value =
    payload.view.state.values.section678?.templateName?.selected_option.value ??
    "Fire";

  const chosenTemplate = getChosenTemplate(value);
  const content: Content[] = (await chosenTemplate)
    ?.content as unknown as Content[];
  console.log(content);

  const texts = content
    ?.filter((c: Content) => c?.type === 0)
    .map((t) => {
      return {
        type: "input",
        block_id: value + " " + t.id,
        element: {
          type: "plain_text_input",
          initial_value: t.text,
          action_id: "text_input",
        },
        label: {
          type: "plain_text",
          text: "Input " + t.id,
        },
      } as Block;
    });
  console.log(texts);

  await slackClient.views.update({
    view_id: payload.view.id,
    hash: payload.view.hash,
    view: {
      type: "modal",
      callback_id: "modal-identifier",
      private_metadata: payload.view.private_metadata,
      title: {
        type: "plain_text",
        text: "Make your kudo!",
      },
      blocks: [
        {
          type: "section",
          block_id: "section678",
          text: {
            type: "mrkdwn",
            text: "Pick a template",
          },
          accessory: {
            action_id: "templateName",
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select an item",
            },
            options: names,
          },
        },
        ...texts,
      ],
      submit: {
        type: "plain_text",
        text: "Send",
      },
    },
  });
};

const sendFirstModal = async (trigger_id: string, channel_id: string) => {
  const templates = getAllTemplates();

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  const names: PlainTextOption[] = (await templates).map((t) => {
    return {
      text: { type: "plain_text", text: t.name },
      value: t.name,
    };
  });

  await slackClient.views.open({
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "modal-identifier",
      private_metadata: channel_id,
      title: {
        type: "plain_text",
        text: "Make your kudo!",
      },
      blocks: [
        {
          type: "section",
          block_id: "section678",
          text: {
            type: "mrkdwn",
            text: "Pick a template",
          },
          accessory: {
            action_id: "templateName",
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select an item",
            },
            options: names,
          },
        },
      ],
    },
  });
};

const sendAuthenticationModal = async (trigger_id: string, user_id: string) => {
  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);

  await slackClient.views.open({
    trigger_id: trigger_id,
    view: {
      type: "modal",
      callback_id: "modal-identifier",
      title: {
        type: "plain_text",
        text: "Permissions!",
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Click this button to go to give permisions, then you can send kudo's:",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Click here",
            },
            action_id: "open_destination",
            url:
              "https://slack.com/oauth/v2/authorize?scope=&user_scope=files:write,chat:write&client_id=5141846691238.5170475885331&state=" +
              user_id,
          },
        },
      ],
      submit: {
        type: "plain_text",
        text: "Send",
      },
    },
  });
};

const sendKudo = async (payload: Payload) => {
  const userName = payload.user.name;
  const channel = payload.view.private_metadata;
  console.log(channel);

  const value =
    payload.view.state.values.section678?.templateName?.selected_option.value ??
    "Fire";
  console.log(value);

  const messages = Object.keys(payload.view.state.values)
    .map((blockId) => {
      console.log(blockId);
      const id = blockId.split(" ");
      console.log(id);

      const blockValues = payload.view.state.values[blockId];
      console.log(blockValues);

      if (blockValues && id[1]) {
        const actionId = Object.keys(blockValues)[0] ?? "";
        console.log(actionId);
        const value = blockValues[actionId]?.value;
        console.log(value);

        if (value) {
          return {
            id: id[1],
            text: value,
          };
        }
      }
    })
    .filter((message) => message !== null);

  console.log(messages);

  if (userName) {
    const user = await findUserByNameForSlack(userName.replace(".", " "));
    if (!user || !user.access_token) {
    } else {
      const personalClient: WebClient = new WebClient(user.access_token);

      const base64 = await makeSlackKudo(value, messages);
      try {
        await personalClient.files.uploadV2({
          channel_id: channel,
          file: Buffer.from(base64, "base64"),
          filename: "kudo.jpg",
          title: "Mooie kudo!",
          as_user: true,
        });
      } catch (error) {
        console.error("Error uploading file to Slack:", error);
      }
    }
  }
};
