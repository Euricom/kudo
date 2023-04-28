import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { object, string } from "zod";
import { TRPCError } from "@trpc/server";

const inputGetById = object({
  id: string(),
});

export const notificationRouter = createTRPCRouter({
  getNotificationsById: protectedProcedure
    .input(inputGetById)
    .query(({ input, ctx }) => {
      return ctx.prisma.notification.findMany({
        where: {
          userId: input.id,
        },
      });
    }),

  getAmountOfNotificationsById: protectedProcedure
    .input(inputGetById)
    .query(({ input, ctx }) => {
      return ctx.prisma.notification.count({
        where: {
          userId: input.id,
          read: false,
        },
      });
    }),

  readNotification: protectedProcedure
    .input(inputGetById)
    .mutation(async ({ input, ctx }) => {
      const notification = await ctx.prisma.notification.update({
        where: {
          id: input.id,
        },
        data: {
          read: true,
        },
      });

      if (notification == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  readAllNotifications: protectedProcedure
    .input(inputGetById)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.notification.updateMany({
        where: {
          userId: input.id,
        },
        data: {
          read: true,
        },
      });
    }),
});
