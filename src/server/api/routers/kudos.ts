import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { boolean, nativeEnum, object, optional, string } from "zod";
import { type Kudo, type Image } from "@prisma/client";
import {
  findAllKudosSortedByUserId,
  getKudosBySessionId,
} from "~/server/services/kudoService";
import {
  createPusherKudo,
  deletePusherKudo,
} from "~/server/services/pusherService";
import { SortPosibillities } from "~/types";
import { TRPCError } from "@trpc/server";
import {
  sendnotification,
  sendnotificationsToAdmins,
} from "~/server/services/notificationService";
import { findUserById } from "~/server/services/userService";
import { getSessionById } from "~/server/services/sessionService";
import { uploadImage } from "~/server/services/image-service";

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
  sort: optional(nativeEnum(SortPosibillities)),
});

const inputLike = object({
  id: string(),
  userId: string(),
  liked: boolean(),
});
const inputComment = object({
  id: string(),
  userId: string(),
  comment: string(),
});
const inputGetImagesByIds = object({
  ids: string().array(),
});

const inputFlag = object({
  id: string(),
  userId: string(),
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

      await deletePusherKudo(kudo);

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
        await createPusherKudo(kudo);
        const sender = await findUserById(input.userId);
        const session = await getSessionById(input.sessionId);

        if (!session) {
          throw new TRPCError({ code: "NOT_FOUND", message: "session" });
        }

        const notificationPromises = session.speakerId.map((id) =>
          sendnotification(
            ctx.prisma,
            sender.displayName +
              " sent you a kudo for your session about " +
              session.title,
            "/kudo/" + kudo.id,
            id,
            sender.id
          )
        );
        await Promise.all(notificationPromises);
      }
      return kudo;
    }),

  createKudoImage: protectedProcedure
    .input(createImageInput)
    .mutation(async ({ input, ctx }): Promise<Image> => {
      let url;
      try {
        url = await uploadImage(input.dataUrl);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not save image",
        });
      }
      const image = await ctx.prisma.image.create({
        data: {
          dataUrl: url,
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

      if (!kudo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kudo not found",
        });
      }

      const sender = await findUserById(input.userId);
      const session = await getSessionById(kudo.sessionId);
      const receiver = await findUserById(kudo.userId);

      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "session" });
      }
      await sendnotification(
        ctx.prisma,
        sender.displayName +
          " liked the kudo you send for the session about " +
          session.title,
        "/kudo/" + kudo.id,
        receiver.id,
        sender.id
      );
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
        const sender = await findUserById(input.userId);
        const session = await getSessionById(kudo.sessionId);
        const receiver = await findUserById(kudo.userId);

        if (!session) {
          throw new TRPCError({ code: "NOT_FOUND", message: "session" });
        }

        await sendnotification(
          ctx.prisma,
          sender.displayName +
            " commented on the kudo you send for the session about " +
            session.title,
          "/kudo/" + kudo.id,
          receiver.id,
          sender.id
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
      if (kudo) {
        const sender = await findUserById(kudo.userId);
        const receiver = await findUserById(input.userId);

        sendnotificationsToAdmins(
          ctx.prisma,
          "Kudo send by " +
            sender.displayName +
            " is reported by " +
            receiver.displayName,
          "/kudo/" + kudo.id,
          sender.id
        );
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
