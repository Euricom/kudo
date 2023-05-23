import { type NextApiRequest, type NextApiResponse } from "next";
import {
  getAllTemplates,
  getChosenTemplate,
  makeSlackKudo,
} from "~/server/services/kudoService";
// import { openModal } from "~/server/services/slackService";
import { env } from "~/env.mjs";
import {
  WebClient,
  type FilesUploadResponse,
  PlainTextOption,
  Block,
} from "@slack/web-api";
import {
  findUserByName,
  findUserByNameForSlack,
} from "~/server/services/userService";
import { log } from "console";

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
    blocks: object[];
    private_metadata: string;
    callback_id: string;
    state: {
      values: {
        section678: {
          templateName: {
            type: string;
            selected_option: {
              text: { type: string; text: string; emoji: boolean };
              value: string;
            };
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
  payload?: Payload;
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
  res.status(200);
  console.log(req.body);
  const payload = (req.body as body).payload;
  // if (payload) {
  //   console.log(payload);
  //   await sendSecondModal(req.body as body);
  // }

  const text: string = (req.body as body).text;
  const channel: string = (req.body as body).channel_id;
  const trigger_id: string = (req.body as body).trigger_id;
  const userId = (req.body as body).user_id;
  const userName = (req.body as body).user_name;
  console.log(userName);

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  const personalClient: WebClient = new WebClient(
    "xoxp-5141846691238-5133909828375-5200979736101-298d5831ae1427b9a9921402db3a2d07"
  );

  // const slackUser = await slackClient.users.profile.get({
  //   user: userId,
  // });
  // console.log("hier is de name");
  // const name = slackUser.profile?.real_name? ?? "";
  // console.log(name);

  const user = await findUserByNameForSlack(userName.replace(".", " "));

  console.log(user?.id);
  if (!user) {
    res.send("er ging iets fout");
    res.end();
  } else if (user && !user.access_token) {
    await sendAuthenticationModal(trigger_id, user?.id ?? "");
  }

  //Direct message werkt niet
  // if (channel.startsWith("D")) {
  //   res
  //     .status(200)
  //     .json(
  //       "Something went wrong, you can not send kudos in a private message, Sorry!"
  //     );
  // }

  //info over channel opvragen
  // let channelInfoResponse;
  // try {
  //   channelInfoResponse = await slackClient.conversations.info({
  //     channel: channel,
  //   });
  // } catch (e) {
  //   res.status(200).json("Something went wrong, this channel was not found.");
  //   res.end();
  // }
  // if (!channelInfoResponse?.ok) {
  //   res.status(200).json("Something went wrong, this channel was not found.");
  //   res.end();
  // } else if (!channelInfoResponse.channel?.is_channel) {
  //   res
  //     .status(200)
  //     .json(
  //       "Something went wrong, you can not send kudos in a private message, Sorry!"
  //     );
  //   res.end();
  // }
  // if (!channelInfoResponse?.channel?.is_member) {
  //   await slackClient.conversations.join({
  //     channel: channel,
  //   });
  // }
  //
  //
  //
  if (text !== "") {
    const base64 = await makeSlackKudo(text);

    // Initialize the Slack Web Client

    // Send the file to the appropriate channel
    try {
      await personalClient.files.uploadV2({
        channels: channel,
        file: Buffer.from(base64, "base64"),
        filename: "kudo.jpg",
        title: "Mooie kudo!",
        as_user: true,
      });
    } catch (error) {
      console.error("Error uploading file to Slack:", error);
    }
  } else {
    await sendFirstModal(trigger_id);

    // await slackClient.views.update({
    //   trigger_id: trigger_id,
    //   view: {
    //     type: "modal",
    //     callback_id: "modal-identifier",
    //     title: {
    //       type: "plain_text",
    //       text: "Make your kudo!",
    //     },
    //     blocks: [
    //       {
    //         type: "section",
    //         block_id: "section678",
    //         text: {
    //           type: "mrkdwn",
    //           text: "Pick a template",
    //         },
    //         accessory: {
    //           action_id: "templateName",
    //           type: "static_select",
    //           placeholder: {
    //             type: "plain_text",
    //             text: "Select an item",
    //           },
    //           options: names,
    //         },
    //       },
    //       {
    //         type: "section",
    //         block_id: "section-identifier",
    //         accessory: {
    //           type: "button",
    //           text: {
    //             type: "plain_text",
    //             text: "Next",
    //           },
    //           action_id: "button-identifier",
    //         },
    //       },
    //     ],
    //     submit: {
    //       type: "plain_text",
    //       text: "Send",
    //     },
    //   },
    // });
  }
  res.end();
}
const sendSecondModal = async (body: body) => {
  console.log("Hier komt hij: ");
  const payload = body.payload as Payload;
  console.log(payload);

  const templates = getAllTemplates();

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);
  const names: PlainTextOption[] = (await templates).map((t) => {
    return {
      text: { type: "plain_text", text: t.name },
      value: t.name,
    };
  });
  console.log(payload.actions);
  // console.log(payload.actions[0]);
  // console.log(payload.actions[0].selected_option.value);
  const value =
    payload.view.state.values.section678.templateName.selected_option.value;
  console.log(value);

  const chosenTemplate = getChosenTemplate(value);
  const content: Content[] = (await chosenTemplate)
    ?.content as unknown as Content[];
  console.log(content);

  const texts = content
    ?.filter((c: Content) => c?.type === 0)
    .map((t) => {
      return {
        type: "input",
        element: {
          type: "plain_text_input",
          initial_value: t.text,
        },
        label: {
          type: "plain_text",
          text: "Input " + t.id,
        },
      } as Block;
    });

  await slackClient.views.update({
    token: payload.token,
    view_id: payload.view.id,
    hash: payload.view.hash,

    trigger_id: payload.trigger_id,
    view: {
      type: "modal",
      callback_id: "modal-identifier",
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
              text: value,
            },
            options: names,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Enter your input:*",
          },
        },
        ...texts,
        {
          type: "section",
          block_id: "section-identifier",
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Next",
            },
            action_id: "button-identifier",
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

const sendFirstModal = async (trigger_id: string) => {
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
        // {
        //   type: "section",
        //   block_id: "section-identifier",
        //   accessory: {
        //     type: "button",
        //     text: {
        //       type: "plain_text",
        //       text: "Next",
        //     },
        //     action_id: "button-identifier",
        //   },
        // },
      ],
      submit: {
        type: "plain_text",
        text: "Send",
      },
    },
  });
};

// type Payload = {
//   view: {
//     state: {
//       kudotext: {
//         value: string
//       }
//     },
//     private_metadata: string,
//   },
// }

// async function handleViewSubmission(payload: Payload) {
//   const { view } = payload;
//   const kudoText = view.state.kudotext.value;
//   const channelId = view.private_metadata;

//   // Generate the kudo image
//   const base64 = await makeSlackKudo(kudoText);

//   // Upload the image to Slack
//   const slackClient = new WebClient(env.SLACK_APP_TOKEN);
//   await slackClient.files.upload({
//     channels: channelId,
//     file: Buffer.from(base64, "base64"),
//     filename: "kudo.jpg",
//     title: "Kudo",
//   });
// }

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
