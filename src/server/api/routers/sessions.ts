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

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const sessionRouter = createTRPCRouter({

    getAll: protectedProcedure.query(async () => {
        return await fetch(`${getBaseUrl()}/api/sessions`).then(result => result.json()) as result
    })
});
