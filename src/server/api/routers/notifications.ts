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
});
