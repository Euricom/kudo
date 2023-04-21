import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";

const inputGetById = object({
    id: string(),
})

export const notificationRouter = createTRPCRouter({

    getNotificationsById: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        return ctx.prisma.notification.findMany({
            where: {
                userId: input.id
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

});
