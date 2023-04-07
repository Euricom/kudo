import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { findAllUsers, findRelevantUsers, findUserById } from "~/server/services/userService";

const inputGetById = object({
    id: string(),
})

const inputUpdate = object({
    id: string(),
    email: string(),
    // role: string(),
})

export const userRouter = createTRPCRouter({

    getAllUsers: protectedProcedure.query(async () => {
        return await findAllUsers()
    }),

    getRelevantUsers: protectedProcedure.query(async ({ ctx }) => {
        return await findRelevantUsers(ctx)
    }),

    getUserById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await findUserById(input.id)
    }),

    updateUserIdAfterLogin: protectedProcedure.input(inputUpdate).mutation(async ({ input, ctx }) => {
        const userId = (await findAllUsers()).find(user => user.mail === input.email)?.id
        const adminList = ["046df486-1162-4d77-9165-b7b9d20efaca", "cdb23f58-65db-4b6b-b132-cf2d13d08e76", "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2"] //Kobe: 18d332af-2d5b-49e5-8c42-9168b3910f97
        if (userId !== input.id) {
            await ctx.prisma.user.update({
                where: {
                    email: input.email,
                },
                data: {
                    id: userId,
                    role: adminList.includes(userId??"") ? "ADMIN" : "USER",
                }
            });
        }

    }),
});
