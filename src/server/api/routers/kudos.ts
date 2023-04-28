import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { boolean, nativeEnum, object, string } from "zod";
import { type Kudo, type Image } from "@prisma/client";
import {
  findAllKudosSortedByUserId,
  getKudosBySessionId,
} from "~/server/services/kudoService";
import { updatePusherKudos } from "~/server/services/pusherService";
import { SortPosibillities } from "~/types";
import { TRPCError } from "@trpc/server";
import {
  sendnotification,
  sendnotificationsToAdmins,
} from "~/server/services/notificationService";
import { findUserById } from "~/server/services/userService";
import { getSessionById } from "~/server/services/sessionService";

const createKudoInput = object({
  image: string(),
  sessionId: string(),
  userId: string(),
  anonymous: boolean(),
});
const createImageInput = object({
  dataUrl: string(),
});

const inputGetById = object({
  id: string(),
});

const inputGetByIdSorted = object({
  id: string(),
  sort: nativeEnum(SortPosibillities),
});

const inputLike = object({
  id: string(),
  liked: boolean(),
});
const inputComment = object({
  id: string(),
  comment: string(),
});
const inputGetImagesByIds = object({
  ids: string().array(),
});

const inputFlag = object({
  id: string(),
  flagged: boolean(),
});

export const kudoRouter = createTRPCRouter({
  getAllKudos: protectedProcedure.query(({ ctx }) => {
    const kudo = ctx.prisma.kudo.findMany({});
    return kudo;
  }),

  getKudosByUserId: protectedProcedure
    .input(inputGetByIdSorted)
    .query(async ({ input }) => {
      const kudos = await findAllKudosSortedByUserId(input.id, input.sort);
      return kudos;
    }),

  getKudosBySessionId: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      const kudos = await getKudosBySessionId(input.id);
      return kudos;
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

      await updatePusherKudos(kudo.sessionId);

      if (kudo == undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while deleting this kudo, please try again later.",
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
          message:
            "An unexpected error occurred while deleting this kudo, please try again later.",
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
      if (kudo) {
        await updatePusherKudos(kudo.sessionId);
        const sender = await findUserById(input.userId);
        const session = await getSessionById(input.sessionId);
        const speaker = await findUserById(session.speakerId);

        await sendnotification(
          ctx.prisma,
          sender.displayName +
            " sent you a kudo for your session about " +
            session.title,
          "/kudo/" + kudo.id,
          speaker.id,
          sender.id
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
      const kudo = await ctx.prisma.kudo.update({
        where: {
          id: input.id,
        },
        data: {
          liked: input.liked,
        },
      });

      if (kudo) {
        const sender = await findUserById(kudo.userId);
        const session = await getSessionById(kudo.sessionId);
        const speaker = await findUserById(session.speakerId);

        await sendnotification(
          ctx.prisma,
          speaker.displayName +
            " liked the kudo you send for the session about " +
            session.title,
          "/kudo/" + kudo.id,
          sender.id,
          speaker.id
        );
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred with your like, please try again later.",
        });
      }
    }),

  commentKudoById: protectedProcedure
    .input(inputComment)
    .mutation(async ({ input, ctx }) => {
      const kudo = await ctx.prisma.kudo.update({
        where: {
          id: input.id,
        },
        data: {
          comment: input.comment,
        },
      });
      if (kudo) {
        const sender = await findUserById(kudo.userId);
        const session = await getSessionById(kudo.sessionId);
        const speaker = await findUserById(session.speakerId);

        await sendnotification(
          ctx.prisma,
          speaker.displayName +
            " commented on the kudo you send for the session about " +
            session.title,
          "/kudo/" + kudo.id,
          sender.id,
          speaker.id
        );
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred with your comment, please try again later.",
        });
      }
    }),

  flagKudoById: protectedProcedure
    .input(inputFlag)
    .mutation(async ({ input, ctx }) => {
      const kudo = await ctx.prisma.kudo.update({
        where: {
          id: input.id,
        },
        data: {
          flagged: input.flagged,
        },
      });
      // if (kudo) {
      //   const sender = await findUserById(kudo.userId);
      //   const session = await getSessionById(kudo.sessionId);
      //   const speaker = await findUserById(session.speakerId);

      //   sendnotificationsToAdmins(
      //     ctx.prisma,
      //     "Kudo send by " +
      //       sender.displayName +
      //       " is reported by " +
      //       speaker.displayName,
      //     "/kudo/" + kudo.id,
      //     sender.id
      //   );
      // } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Een probleem",
      });
      // }
    }),
});
