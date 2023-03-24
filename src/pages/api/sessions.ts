import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        sessions: [
            { id: "1", title: "Designing with Figma", date: new Date(), speakerId: "cdb23f58-65db-4b6b-b132-cf2d13d08e76" },
            { id: "2", title: "React hooks", date: new Date(), speakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "3", title: "UX/UI", date: new Date(), speakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "4", title: "Typescript 5.0", date: new Date("02/18/2023"), speakerId: "e1db4a6b-a5ac-40c8-83da-f3492b0f92db" },
            { id: "5", title: "Everything you need to know about React", date: new Date("01/16/2023"), speakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "6", title: "Prisma, the connection to your database", date: new Date("02/02/2023"), speakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "7", title: "Design survey results", date: new Date("01/21/2023"), speakerId: "cdb23f58-65db-4b6b-b132-cf2d13d08e76" },
            { id: "8", title: "DevOps", date: new Date("01/18/2023"), speakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "9", title: "Next.js, the future", date: new Date("01/02/2023"), speakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "10", title: "NoSQL, the future of your database", date: new Date("12/23/2022"), speakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "11", title: "Java, is it still relevant", date: new Date("11/20/2022"), speakerId: "a2e96214-3829-4abd-b98f-7bdd6d4f59b9" },
            { id: "12", title: "Comparison: Javascript or C#", date: new Date("11/7/2022"), speakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "13", title: "Angular", date: new Date("11/1/2022"), speakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "14", title: "Best component library", date: new Date("10/20/2022"), speakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "15", title: "Is the business analyst still relevant in Agile", date: new Date("9/20/2022"), speakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "16", title: "Agile vs Scrum", date: new Date("9/8/2022"), speakerId: "63061de7-0a1f-471f-b9bd-5db02536157b" },
            { id: "17", title: "Functional analysis", date: new Date("8/4/2022"), speakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "18", title: "Tailwind vs CSS", date: new Date("7/5/2022"), speakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "19", title: "Aren't relational databases the best", date: new Date("10/07/2022"), speakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "20", title: "Learn more about th core of Javascript", date: new Date("12/05/2022"), speakerId: "e1db4a6b-a5ac-40c8-83da-f3492b0f92db" },]
    })
} 