import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string, boolean } from "zod";

const createKudoInput = object({
    image: string(),
    liked: boolean(),
    comment: string(),
    sessionId: string(),
    userId: string(),
})

const inputGetById = object({
    id: string(),
})

type Image = {
    id: string
    dataUrl: string
}

export const kudoRouter = createTRPCRouter({

    createKudo: protectedProcedure.input(createKudoInput).query(({ input, ctx }) => {

        const image: Image = ctx.prisma.image.create({
            data: {
                dataUrl: input.image,
            },
        }) as unknown as Image;
        const kudo = ctx.prisma.kudo.create({
            data: {
                image: image.id,
                liked: false,
                comment: '',
                sessionId: input.sessionId,
                userId: input.userId,
            },
        });
        return kudo;
    }),

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
        console.log(input.id);

        const kudo = ctx.prisma.kudo.findUnique({
            where: {
                id: input.id,
            }
        });

        console.log(kudo);
        return kudo
    }),


});

