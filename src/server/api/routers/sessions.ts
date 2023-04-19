import { env } from "~/env.mjs";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { object, string } from "zod";
import { type Session, type SessionArray } from "~/types";
// import { findUserById, getImageById } from "~/server/services/userService";


const inputGetById = object({
    id: string(),
})

// export async function makeDataUrl(image?: Response) {
//     if (!image) {
//         return
//     }
//     return {
//         dataUrl:
//             `data:${image?.headers.get('content-type') ?? ""};base64,` +
//             Buffer.from(await image.arrayBuffer()).toString('base64'),
//     }
// }

// async function addSpeaker(session: Session) {
//     const speaker = await findUserById(session.speakerId)
//     await getImageById(session.speakerId).then(e => makeDataUrl(e).then(e => speaker.image = e?.dataUrl))
//     session.speaker = speaker
// }

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()) as SessionArray
        // result.sessions.map(async (s) => {
        //     await addSpeaker(s)
        // })
        return result.sessions
    }),

    getSessionsBySpeaker: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()).then((result: SessionArray) => result.sessions.filter((r: Session) => r.speakerId === input.id))

        // const img = await getImageById(result[0]?.speakerId ?? "").then(e => makeDataUrl(e))
        // const speaker = await findUserById(result[0]?.speakerId ?? "")
        // speaker.image = img?.dataUrl
        // result.map((s) => {
        //     s.speaker = speaker
        // })
        return result
    }),

    getSessionById: protectedProcedure.input(inputGetById).query(async ({ input }) => {
        const result = await fetch(`${env.SESSION_URL}`).then(result => result.json()).then((result: SessionArray) => result.sessions.find(r => r.id.toString() === input.id)) as Session
        // await addSpeaker(result)
        return result
    }),
});
