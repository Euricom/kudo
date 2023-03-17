import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        sessions: [
            { id: 1, Title: "Ted talk 1", Date: "23/02/2023", SpeakerId: "a" },
            { id: 2, Title: "Gaming", Date: "23/02/2023", SpeakerId: "b" },
            { id: 3, Title: "?", Date: "21/02/2023", SpeakerId: "c" },
            { id: 4, Title: "Iets", Date: "18/02/2023", SpeakerId: "d" },
            { id: 5, Title: "Ted talk 2", Date: "16/02/2023", SpeakerId: "e" },
            { id: 6, Title: "Gaming V", Date: "02/02/2023", SpeakerId: "f" },
            { id: 7, Title: "??", Date: "21/01/2023", SpeakerId: "g" },
            { id: 8, Title: "Nog iets", Date: "18/01/2023", SpeakerId: "h" },
            { id: 9, Title: "Ted talk 3", Date: "2/01/2023", SpeakerId: "i" },
            { id: 10, Title: "Fast Gaming", Date: "23/12/2022", SpeakerId: "j" },
            { id: 11, Title: "???", Date: "20/11/2022", SpeakerId: "k" },
            { id: 12, Title: "Nog maar iets", Date: "7/11/2022", SpeakerId: "l" },
            { id: 13, Title: "Ted talk 4", Date: "1/11/2022", SpeakerId: "m" },
            { id: 14, Title: "Fast and the Gaming", Date: "20/10/2022", SpeakerId: "n" },
            { id: 15, Title: "????", Date: "20/9/2022", SpeakerId: "o" },
            { id: 16, Title: "Nog maar eens iets", Date: "8/9/2022", SpeakerId: "p" },
            { id: 17, Title: "Ted talk 5", Date: "4/8/2022", SpeakerId: "q" },
            { id: 18, Title: "To fast to Gaming", Date: "5/7/2022", SpeakerId: "r" },
            { id: 19, Title: "?????", Date: "7/10/2022", SpeakerId: "s" },
            { id: 20, Title: "Ook nog maar eens iets", Date: "5/12/2022", SpeakerId: "t" },]
    })
} 