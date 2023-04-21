import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, optional, string } from "zod";

const inputGetById = object({
    id: string(),
})

const inputsendNotification = object({
    message: string(),
    userId: string(),
    kudoId: optional(string()),
    sessionId: optional(string()),
    photo: optional(string()),
})

export const notificationRouter = createTRPCRouter({

    getNotificationsById: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        return ctx.prisma.notification.findMany({
            where: {
                userId: input.id
            }
        })
    }),

    getAmountOfNotificationsById: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        return ctx.prisma.notification.count({
            where: {
                userId: input.id,
                read: false
            }
        })
    }),


    readNotification: protectedProcedure.input(inputGetById).mutation(async ({ input, ctx }) => {

        const notification = await ctx.prisma.notification.update({
            where: {
                id: input.id,
            },
            data: {
                read: true,
            }
        });

        if (notification == undefined) {
            throw new Error()
        }
    }),

    readAllNotifications: protectedProcedure.input(inputGetById).mutation(async ({ input, ctx }) => {

        await ctx.prisma.notification.updateMany({
            where: {
                userId: input.id,
            },
            data: {
                read: true,
            }
        });
    }),

    // Create
    sendnotification: protectedProcedure.input(inputsendNotification).mutation(async ({ input, ctx }) => {
        await ctx.prisma.notification.create({
            data: {
                message: input.message,
                userId: input.userId,
                kudoId: input.kudoId,
                sessionId: input.sessionId,
                photo: input.photo
            },
        });
    }),

});
