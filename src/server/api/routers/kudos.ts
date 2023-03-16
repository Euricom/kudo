import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { type Kudo, type Image } from "@prisma/client";

const createKudoInput = object({
    image: string(),
    sessionId: string(),
    userId: string(),
})
const createImageInput = object({
    dataUrl: string(),
})

const inputGetById = object({
    id: string(),
})


export const kudoRouter = createTRPCRouter({


    getKudosByUserId: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        return ctx.prisma.kudo.findMany({
            where: {
                userId: input.id,
            }
        });
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

    deleteKudoById: protectedProcedure.input(inputGetById).mutation(async ({ input, ctx }) => {
        const kudo = await ctx.prisma.kudo.delete({
            where: {
                id: input.id,
            }
        });

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


    createKudo: protectedProcedure.input(createKudoInput).mutation(async ({ input, ctx }): Promise<Kudo> => {

        const kudo = (await ctx.prisma.kudo.create({
            data: {
                image: input.image,
                liked: false,
                comment: '',
                sessionId: input.sessionId,
                userId: input.userId,
            },
        }));
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







});

