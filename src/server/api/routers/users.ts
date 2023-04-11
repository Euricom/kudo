import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { findAllUsers, findUserById } from "~/server/services/userService";

const inputGetById = object({
    id: string(),
})

const inputUpdate = object({
    id: string(),
    email: string(),
})


export const userRouter = createTRPCRouter({

    getAllUsers: protectedProcedure.query(async () => {
        return await findAllUsers()
    }),

    getUserById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await findUserById(input.id)
    }),

    // getUserImageById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
    //     const blob = await findUserImageById(input.id, )
    //     console.log(blob);

    //     return blob

    // }),


    updateUserIdAfterLogin: protectedProcedure.input(inputUpdate).mutation(async ({ input, ctx }) => {

        const userId = (await findAllUsers()).find(user => user.mail === input.email)?.id
        if (userId !== input.id) {
            await ctx.prisma.user.update({
                where: {
                    email: input.email,
                },
                data: {
                    id: userId,
                }
            });
        }

    }),
});
