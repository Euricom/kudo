import { env } from "~/env.mjs";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { type Session, type SessionArray } from "~/types";
import { getImageById } from "~/server/services/userService";


const inputGetById = object({
    id: string(),
})

async function makeDataUrl(image?: Response) {
    if (!image) {
        return
    }
    return {
        dataUrl:
            `data:${image?.headers.get('content-type') ?? ""};base64,` +
            Buffer.from(await image.arrayBuffer()).toString('base64'),
    }
}

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()) as SessionArray
        result.sessions.map(s => {
            getImageById(s.speakerId).then(e => makeDataUrl(e).then(e => s.speakerImage = e?.dataUrl)).catch(console.error)
        })
        return result.sessions
    }),

    getSessionsBySpeaker: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()).then((result: SessionArray) => result.sessions.filter((r: Session) => r.speakerId === input.id))
        result.map(s => {
            getImageById(s.speakerId).then(e => makeDataUrl(e).then(e => s.speakerImage = e?.dataUrl)).catch(console.error)
        })
        return result
    }),

    getSessionById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()).then((result: SessionArray) => result.sessions.find(r => r.id.toString() === input.id)) as Session
        getImageById(result.speakerId).then(e => makeDataUrl(e).then(e => result.speakerImage = e?.dataUrl)).catch(console.error)

        return result
    }),
});
