import { type NextApiRequest, type NextApiResponse } from "next";
import { getAllTemplates, makeSlackKudo } from "~/server/services/kudoService";
// import { openModal } from "~/server/services/slackService";
import { env } from "~/env.mjs";
import {
  WebClient,
  type FilesUploadResponse,
  PlainTextOption,
} from "@slack/web-api";

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
  console.log("erin");

  res.status(200);
  const text: string = (req.body as body).text;
  const channel: string = (req.body as body).channel_id;
  const trigger_id: string = (req.body as body).trigger_id;

  const slackClient: WebClient = new WebClient(env.SLACK_APP_TOKEN);

  const base64 = await makeSlackKudo(text);

  // Initialize the Slack Web Client

  // Send the file to the appropriate channel
  try {
    await slackClient.files.upload({
      channels: "C054FAZS2FN",
      file: Buffer.from(base64, "base64"),
      filename: "kudo.jpg",
      title: "Mooie kudo jonge",
    });
  } catch (error) {
    console.error("Error uploading file to Slack:", error);
  }
  //Direct message werkt niet
  console.log(channel);

  // if (channel.startsWith("D")) {
  //   res
  //     .status(200)
  //     .json(
  //       "Something went wrong, you can not send kudos in a private message, Sorry!"
  //     );
  // }

  //info over channel opvragen
  if (text !== "") {
    const base64 = await makeSlackKudo(text);

    // Initialize the Slack Web Client
    const slackClient = new WebClient(env.SLACK_APP_TOKEN);

    // Send the file to the appropriate channel
    try {
      await slackClient.files.upload({
        channels: channel,
        file: Buffer.from(base64, "base64"),
        filename: "kudo.jpg",
        title: "Mooie kudo!",
      });
    } catch (error) {
      console.error("Error uploading file to Slack:", error);
    }
  } else {
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
    //Als bot geen lid is van channel, join de channel.
    if (!channelInfoResponse?.channel?.is_member) {
      await slackClient.conversations.join({
        channel: channel,
      });
    }
    const templates = getAllTemplates();
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
