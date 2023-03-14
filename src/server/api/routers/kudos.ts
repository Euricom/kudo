import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { type Kudo } from "@prisma/client";

type result = {
    sessions: Kudo[]
}

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch('http://localhost:3000/api/sessions').then(result => result.json()) as result
    })
});