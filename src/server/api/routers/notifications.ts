import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, optional, string } from "zod";
import { adminList } from "~/server/auth";

const inputGetById = object({
    id: string(),
})

const inputsendNotification = object({
    message: string(),
    userId: string(),
    link: string(),
    photo: optional(string()),
})
const inputsendAdminsNotification = object({
    message: string(),
    link: string(),
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
                link: input.link,
                photo: input.photo
            },
        });
    }),
    // Create
    sendnotificationsToAdmins: protectedProcedure.input(inputsendAdminsNotification).mutation(({ input, ctx }) => {
        const admins = adminList
        admins.map(async (admin) => {
            await ctx.prisma.notification.create({
                data: {
                    message: input.message,
                    userId: admin,
                    link: input.link,
                    photo: input.photo
                },
            });
        })

    }),

});
