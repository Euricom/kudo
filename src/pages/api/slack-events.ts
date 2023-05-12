import { WebClient } from "@slack/web-api";
import { makeSlackKudo } from "~/server/services/kudoService";
import { env } from "~/env.mjs";
import { NextApiRequest, NextApiResponse } from "next";

interface body {
  event: {
    view: {
      state: {
        values: string;
      };
    };
    type: string;
    private_metadata: string;
  };
  challenge: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const payload = req.body as body;
    const eventType = payload?.event?.type;
    const viewSubmission = payload?.event?.type === "view_submission";

    if (eventType === "url_verification") {
      // Respond to the URL verification challenge during app installation
      const challenge = payload.challenge;
      res.status(200).send(challenge);
    } else if (viewSubmission) {
      // Handle the view_submission event
      const submission = payload.event.view.state.values;
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
          channels: payload.event.private_metadata,
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
