import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        sessions: [
            { id: "1", Title: "Designing with Figma", Date: "23/02/2023", SpeakerId: "cdb23f58-65db-4b6b-b132-cf2d13d08e76" },
            { id: "2", Title: "React hooks", Date: "23/02/2023", SpeakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "3", Title: "UX/UI", Date: "21/02/2023", SpeakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "4", Title: "Typescript 5.0", Date: "18/02/2023", SpeakerId: "e1db4a6b-a5ac-40c8-83da-f3492b0f92db" },
            { id: "5", Title: "Everything you need to know about React", Date: "16/02/2023", SpeakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "6", Title: "Prisma, the connection to your database", Date: "02/02/2023", SpeakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "7", Title: "Design survey results", Date: "21/01/2023", SpeakerId: "cdb23f58-65db-4b6b-b132-cf2d13d08e76" },
            { id: "8", Title: "DevOps", Date: "18/01/2023", SpeakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "9", Title: "Next.js, the future", Date: "2/01/2023", SpeakerId: "5e1378cf-21d2-425d-97f2-f5cf91d9c0c2" },
            { id: "10", Title: "NoSQL, the future of your database", Date: "23/12/2022", SpeakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "11", Title: "Java, is it still relevant", Date: "20/11/2022", SpeakerId: "a2e96214-3829-4abd-b98f-7bdd6d4f59b9" },
            { id: "12", Title: "Comparison: Javascript or C#", Date: "7/11/2022", SpeakerId: "18d332af-2d5b-49e5-8c42-9168b3910f97" },
            { id: "13", Title: "Angular", Date: "1/11/2022", SpeakerId: "Wim Van Hoye" },
            { id: "14", Title: "Best component library", Date: "20/10/2022", SpeakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "15", Title: "Is the business analyst still relevant in Agile", Date: "20/9/2022", SpeakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "16", Title: "Agile vs Scrum", Date: "8/9/2022", SpeakerId: "63061de7-0a1f-471f-b9bd-5db02536157b" },
            { id: "17", Title: "Functional analysis", Date: "4/8/2022", SpeakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "18", Title: "Tailwind vs CSS", Date: "5/7/2022", SpeakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "19", Title: "Aren't relational databases the best", Date: "7/10/2022", SpeakerId: "046df486-1162-4d77-9165-b7b9d20efaca" },
            { id: "20", Title: "Learn more about th core of Javascript", Date: "5/12/2022", SpeakerId: "e1db4a6b-a5ac-40c8-83da-f3492b0f92db" },]
    })
} 