import { type Session } from "@prisma/client";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

type result = {
    sessions: Session[]
}

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as result
    })
});
