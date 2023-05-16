import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { array, object, string } from "zod";
import {
  findAllUsers,
  findRelevantUsers,
  findUserById,
  findUserByIds,
  findUserByName,
} from "~/server/services/userService";
import { adminList } from "~/server/auth";

const inputGetById = object({
  id: string(),
});

const inputGetByIds = object({
  ids: array(string()),
});

const inputUpdate = object({
  id: string(),
  email: string(),
  // role: string(),
});

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async () => {
    return await findAllUsers();
  }),

  getRelevantUsers: protectedProcedure.query(async ({ ctx }) => {
    return await findRelevantUsers(ctx);
  }),

  getUserById: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      return await findUserById(input.id);
    }),

  getUserByIds: protectedProcedure
    .input(inputGetByIds)
    .query(async ({ input }) => {
      // const userPromises = input.ids.map((id) => findUserById(id));
      // const users = await Promise.all(userPromises);
      // return users;
      return await findUserByIds(input.ids);
    }),

  getUserByName: protectedProcedure
    .input(inputGetById)
    .query(async ({ input }) => {
      return await findUserByName(input.id);
    }),

  updateUserIdAfterLogin: protectedProcedure
    .input(inputUpdate)
    .mutation(async ({ input, ctx }) => {
      const userId = (await findAllUsers()).find(
        (user) => user.mail === input.email
      )?.id;
      if (userId !== input.id) {
        await ctx.prisma.user.update({
          where: {
            email: input.email,
          },
          data: {
            id: userId,
            role: adminList.includes(userId ?? "") ? "ADMIN" : "USER",
          },
        });
      }
    }),
});
