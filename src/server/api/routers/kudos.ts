import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { boolean, object, string } from "zod";
import { type Kudo, type Image } from "@prisma/client";
import { getKudosBySessionId } from "~/server/services/kudoService";
import { updatePusherKudos } from "~/server/services/pusherService";

const createKudoInput = object({
    image: string(),
    sessionId: string(),
    userId: string(),
    anonymous: boolean(),
})
const createImageInput = object({
    dataUrl: string(),
})

const inputGetById = object({
    id: string(),
})

const inputLike = object({
    id: string(),
    liked: boolean(),
})
const inputComment = object({
    id: string(),
    comment: string(),
})
const inputGetImagesByIds = object({
    ids: string().array(),
})

const inputFlag = object({
    id: string(),
    flagged: boolean(),
})


export const kudoRouter = createTRPCRouter({

    getAllKudos: protectedProcedure.query(async ({ ctx }) => {
        const kudo = ctx.prisma.kudo.findMany({})
        
        return kudo
    }),

    getKudosByUserId: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        const kudos = ctx.prisma.kudo.findMany({
            where: {
                userId: input.id,
            },
            orderBy: {
                id: 'desc'
            }
        });
        return kudos
    }),

    getKudosBySessionId: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        const kudos = await getKudosBySessionId(input.id)
        return kudos
    }),

    getImageById: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        return ctx.prisma.image.findUnique({
            where: {
                id: input.id,
            }
        });
    }),

    getKudoById: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        const kudo = ctx.prisma.kudo.findUnique({
            where: {
                id: input.id,
            }
        });
        return kudo
    }),

    getFlaggedKudos: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.kudo.findMany({
            where: {
                flagged: true,
            },
            orderBy: {
                id: 'desc'
            }
        });
    }),

    getImagesByIds: protectedProcedure.input(inputGetImagesByIds).query(({ input, ctx }) => {
        return ctx.prisma.image.findMany({
            where: {
                id: {
                    in: input.ids
                },
            }
        });
    }),

    //Delete
    deleteKudoById: protectedProcedure.input(inputGetById).mutation(async ({ input, ctx }) => {
        const kudo = await ctx.prisma.kudo.delete({
            where: {
                id: input.id,
            }
        });

        await updatePusherKudos(kudo.sessionId)

        if (kudo == undefined) {
            throw new Error()
        }
    }),

    deleteImageById: protectedProcedure.input(inputGetById).mutation(async ({ input, ctx }) => {
        const image = await ctx.prisma.image.delete({
            where: {
                id: input.id,
            }
        });

        if (image == undefined) {
            throw new Error()
        }
    }),

    // Create
    createKudo: protectedProcedure.input(createKudoInput).mutation(async ({ input, ctx }): Promise<Kudo> => {
        const kudo = (await ctx.prisma.kudo.create({
            data: {
                image: input.image,
                sessionId: input.sessionId,
                userId: input.userId,
                anonymous: input.anonymous,
            },
        }));

        await updatePusherKudos(input.sessionId)

        return kudo;
    }),

    createKudoImage: protectedProcedure.input(createImageInput).mutation(async ({ input, ctx }): Promise<Image> => {
        const image = (await ctx.prisma.image.create({
            data: {
                dataUrl: input.dataUrl,
            },
        }));
        return image;
    }),

    likeKudoById: protectedProcedure.input(inputLike).mutation(async ({ input, ctx }) => {

        const kudo = await ctx.prisma.kudo.update({
            where: {
                id: input.id,
            },
            data: {
                liked: input.liked,
            }
        });


        if (kudo == undefined) {
            throw new Error()
        }
    }),
    commentKudoById: protectedProcedure.input(inputComment).mutation(async ({ input, ctx }) => {

        const kudo = await ctx.prisma.kudo.update({
            where: {
                id: input.id,
            },
            data: {
                comment: input.comment,
            }
        });

        if (kudo == undefined) {
            throw new Error()
        }
    }),

    flagKudoById: protectedProcedure.input(inputFlag).mutation(async ({ input, ctx }) => {

        const kudo = await ctx.prisma.kudo.update({
            where: {
                id: input.id,
            },
            data: {
                flagged: input.flagged,
            }
        });

        if (kudo == undefined) {
            throw new Error()
        }
    }),
});