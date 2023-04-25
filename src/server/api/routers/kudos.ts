import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { boolean, object, optional, string } from "zod";
import { type Kudo, type Image } from "@prisma/client";
import {
  sendnotification,
  sendnotificationsToAdmins,
} from "~/server/services/notificationService";

const createKudoInput = object({
  image: string(),
  sessionId: string(),
  userId: string(),
  anonymous: boolean(),
  message: optional(string()),
  speakerId: optional(string()),
  photo: optional(string()),
});
const createImageInput = object({
  dataUrl: string(),
});

const inputGetById = object({
  id: string(),
});

const inputLike = object({
  id: string(),
  message: optional(string()),
  userId: optional(string()),
  photo: optional(string()),
  liked: boolean(),
});
const inputComment = object({
  id: string(),
  message: optional(string()),
  userId: optional(string()),
  photo: optional(string()),
  comment: string(),
});
const inputGetImagesByIds = object({
  ids: string().array(),
});

const inputFlag = object({
  id: string(),
  message: optional(string()),
  photo: optional(string()),
  flagged: boolean(),
});

export const kudoRouter = createTRPCRouter({
  getAllKudos: protectedProcedure.query(({ ctx }) => {
    const kudo = ctx.prisma.kudo.findMany({});
    return kudo;
  }),

  getKudosByUserId: protectedProcedure
    .input(inputGetById)
    .query(({ input, ctx }) => {
      return ctx.prisma.kudo.findMany({
        where: {
          userId: input.id,
        },
        orderBy: {
          id: "desc",
        },
      });
    }),

  getKudosBySessionId: protectedProcedure
    .input(inputGetById)
    .query(({ input, ctx }) => {
      return ctx.prisma.kudo.findMany({
        where: {
          sessionId: input.id,
        },
        orderBy: {
          id: "desc",
        },
      });
    }),

  getImageById: protectedProcedure
    .input(inputGetById)
    .query(({ input, ctx }) => {
      return ctx.prisma.image.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getKudoById: protectedProcedure
    .input(inputGetById)
    .query(({ input, ctx }) => {
      const kudo = ctx.prisma.kudo.findUnique({
        where: {
          id: input.id,
        },
      });
      return kudo;
    }),

  getFlaggedKudos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.kudo.findMany({
      where: {
        flagged: true,
      },
      orderBy: {
        id: "desc",
      },
    });
  }),

  getImagesByIds: protectedProcedure
    .input(inputGetImagesByIds)
    .query(({ input, ctx }) => {
      return ctx.prisma.image.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),

  //Delete
  deleteKudoById: protectedProcedure
    .input(inputGetById)
    .mutation(async ({ input, ctx }) => {
      const kudo = await ctx.prisma.kudo.delete({
        where: {
          id: input.id,
        },
      });

      if (kudo == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  deleteImageById: protectedProcedure
    .input(inputGetById)
    .mutation(async ({ input, ctx }) => {
      const image = await ctx.prisma.image.delete({
        where: {
          id: input.id,
        },
      });

      if (image == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  // Create
  createKudo: protectedProcedure
    .input(createKudoInput)
    .mutation(async ({ input, ctx }): Promise<Kudo> => {
      const kudo = await ctx.prisma.kudo.create({
        data: {
          image: input.image,
          sessionId: input.sessionId,
          userId: input.userId,
          anonymous: input.anonymous,
        },
      });
      if (input.message && input.speakerId && input.photo) {
        await sendnotification(
          ctx.prisma,
          input.message,
          "/kudo/" + kudo.id,
          input.speakerId,
          input.photo
        );
      }
      return kudo;
    }),

  createKudoImage: protectedProcedure
    .input(createImageInput)
    .mutation(async ({ input, ctx }): Promise<Image> => {
      const image = await ctx.prisma.image.create({
        data: {
          dataUrl: input.dataUrl,
        },
      });
      return image;
    }),

  likeKudoById: protectedProcedure
    .input(inputLike)
    .mutation(async ({ input, ctx }) => {
      if (input.message && input.userId && input.photo) {
        await sendnotification(
          ctx.prisma,
          input.message,
          "/kudo/" + input.id,
          input.userId,
          input.photo
        );
      }
      const kudo = await ctx.prisma.kudo.update({
        where: {
          id: input.id,
        },
        data: {
          liked: input.liked,
        },
      });

      if (kudo == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
  commentKudoById: protectedProcedure
    .input(inputComment)
    .mutation(async ({ input, ctx }) => {
      if (input.message && input.userId && input.photo) {
        await sendnotification(
          ctx.prisma,
          input.message,
          "/kudo/" + input.id,
          input.userId,
          input.photo
        );
      }
      const kudo = await ctx.prisma.kudo.update({
        where: {
          id: input.id,
        },
        data: {
          comment: input.comment,
        },
      });

      if (kudo == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  flagKudoById: protectedProcedure
    .input(inputFlag)
    .mutation(async ({ input, ctx }) => {
      if (input.message && input.photo) {
        sendnotificationsToAdmins(
          ctx.prisma,
          input.message,
          "/kudo/" + input.id,
          input.photo
        );
      }
      const kudo = await ctx.prisma.kudo.update({
        where: {
          id: input.id,
        },
        data: {
          flagged: input.flagged,
        },
      });

      if (kudo == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
});
