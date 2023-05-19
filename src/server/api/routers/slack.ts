import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { object, string } from "zod";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const inputSendMessage = object({
  text: string(),
  channel: string(),
});
const inputUpdateAccessToken = object({
  code: string(),
  userId: string(),
});

interface SlackResponse {
  ok: boolean;
  channel: string;
  ts: string;
  message: {
    text: string;
  };
}

export const slackRouter = createTRPCRouter({
  sendMessageToSlack: protectedProcedure
    .input(inputSendMessage)
    .mutation(async ({ input }) => {
      const url = "https://slack.com/api/chat.postMessage";
      const token = env.SLACK_APP_TOKEN;

      const body = new URLSearchParams({
        channel: input.channel,
        text: input.text,
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
    }),

  sendMessageToSlackViaHook: protectedProcedure
    .input(inputSendMessage)
    .mutation(async ({ input }) => {
      const url =
        "https://hooks.slack.com/services/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";
      return (await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          text: input.text,
        }),
      }).then((res) => res.json())) as SlackResponse;
    }),

  updateUserWithAccessToken: protectedProcedure
    .input(inputUpdateAccessToken)
    .mutation(async ({ ctx, input }) => {
      const data = {
        client_id: env.clientId,
        client_secret: env.clientSecret,
        code: input.code,
      };
      const url = "https://slack.com/api/oauth.v2.access";
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          data,
        }),
      })
        .then((res) => res.json())
        .then(async (response: { access_token: string }) => {
          const access_token = response.access_token;
          await ctx.prisma.user.update({
            where: {
              id: input.userId,
            },
            data: {
              access_token: access_token,
            },
          });
        });
    }),
});
