import { type NextApiRequest, type NextApiResponse } from "next";
import {
  getFirstImageById,
  makeSlackKudo,
} from "~/server/services/kudoService";
import { getChannelById, openModal } from "~/server/services/slackService";
import image from "~/../../imageForSlack.jpg";
import fs, { ReadStream } from "fs";
import { TRPCError } from "@trpc/server";

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
  // const image = await getFirstImageById().then((i) => i?.dataUrl);
  const base64 = await makeSlackKudo(text);
  try {
    fs.writeFileSync("./image.jpg", base64, "base64");
  } catch (e) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No template was found.",
    });
  }
  let stream;
  try {
    stream = fs.createReadStream("./image.jpg");
  } catch (e) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "No template was found.",
    });
  }
  res.send({
    response_type: "in_channel",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Mooie kudo jonge",
        },
      },
      {
        type: "section",
        accessory: {
          type: "image",
          image_url: stream ?? "test",
          alt_text: "Kudo",
        },
      },
    ],
  }),
    // const channel = await getChannelById(body.channel_id);
    // const response = await openModal(body.trigger_id).catch((e) =>
    //   console.log(e)
    // );
    // console.log(response);

    // const text =
    //   "is het im? " +
    //   channel.is_im.toString() +
    //   ", Name: " +
    //   channel.name +
    //   ", user=" +
    //   channel.user +
    //   "channelId=" +
    //   body.channel_id +
    //   ", chanelName=" +
    //   body.channel_name +
    //   ", userId=" +
    //   body.user_id +
    //   ", userName=" +
    //   body.user_name;
    // const image = await getFirstImageById().then((i) => i?.dataUrl);

    // res.send({
    //   type: "modal",
    //   callback_id: "modal-identifier",
    //   title: {
    //     type: "plain_text",
    //     text: "Just a modal",
    //   },
    //   blocks: [
    //     {
    //       type: "section",
    //       block_id: "section-identifier",
    //       text: {
    //         type: "mrkdwn",
    //         text: "*Welcome* to ~my~ Block Kit _modal_!",
    //       },
    //       accessory: {
    //         type: "button",
    //         text: {
    //           type: "plain_text",
    //           text: "Just a button",
    //         },
    //         action_id: "button-identifier",
    //       },
    //     },
    //   ],
    // });
    res.end();
}
