import { WebClient } from "@slack/web-api";
import { makeSlackKudo } from "~/server/services/kudoService";
import { env } from "~/env.mjs";
import { type NextApiRequest, type NextApiResponse } from "next";

interface body {
  type: string;
  view: {
    id: string;
    type: string;
    private_metadata: string;
    callback_id: string;
    state: {
      values: {
        multiline: {
          mlvalue: {
            type: string;
            value: string;
          };
        };
        target_channel: {
          target_select: {
            type: string;
            selected_conversation: string;
          };
        };
      };
    };
    hash: string;
    response_urls: [
      {
        block_id: string;
        action_id: string;
        channel_id: string;
        response_url: string;
      }
    ];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("erin");

  if (req.method === "POST") {
    const payload = req.body as body;
    const viewSubmission = payload?.type === "view_submission";

    if (viewSubmission) {
      // Handle the view_submission event
      const submission = payload.view.state.values.multiline.mlvalue.value;
      // Extract the necessary data from the submission payload
      // and perform any required processing
      // ...

      // Call makeSlackKudo or any other relevant function
      const base64 = await makeSlackKudo(submission);

      // Initialize the Slack Web Client
      const slackClient = new WebClient(env.SLACK_APP_TOKEN);

      // Send the file to the appropriate channel
      try {
        await slackClient.files.upload({
          channels:
            payload.view.state.values.target_channel.target_select
              .selected_conversation,
          file: Buffer.from(base64, "base64"),
          filename: "kudo.jpg",
          title: "Mooie kudo jonge",
        });
      } catch (error) {
        console.error("Error uploading file to Slack:", error);
      }

      // Send a response to acknowledge the view_submission event
      res.status(200).end();
    } else {
      res.status(200).end();
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
