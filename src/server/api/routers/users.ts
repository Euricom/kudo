import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { findAllUsers, findUserById } from "~/server/services/userService";

const inputGetById = object({
    id: string(),
})

export const userRouter = createTRPCRouter({

    getAllUsers: protectedProcedure.query(async () => {
        return await findAllUsers()
    }),

    getUserById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return await findUserById(input.id)
    }),

    getUserByEmail: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        return (await findAllUsers()).find(user => user.mail === input.id)
    }),

});
