import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

type session = {
    Id: number,
    Title: string,
    Date: string,
    SpeakerId: string,
}

type result = {
    sessions: session[]
}

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as result
    }),

    getSession: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
