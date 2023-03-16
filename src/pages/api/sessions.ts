import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        sessions: [
            { id: 1, title: "Ted talk 1", date: new Date(), speakerId: "a" },
            { id: 2, title: "Gaming", date: new Date(), speakerId: "b" },
            { id: 3, title: "?", date: new Date(), speakerId: "c" },
            { id: 4, title: "Iets", date: new Date("02/23/2023"), speakerId: "d" },
            { id: 5, title: "Ted talk 2", date: new Date("02/23/2023"), speakerId: "e" },
            { id: 6, title: "Gaming V", date: new Date("02/23/2023"), speakerId: "f" },
            { id: 7, title: "??", date: new Date("02/23/2023"), speakerId: "g" },
            { id: 8, title: "Nog iets", date: new Date("01/18/2023"), speakerId: "h" },
            { id: 9, title: "Ted talk 3", date: new Date("01/18/2023"), speakerId: "i" },
            { id: 10, title: "Fast Gaming", date: new Date("01/18/2023"), speakerId: "j" },
            { id: 11, title: "???", date: new Date("01/18/2023"), speakerId: "k" },
            { id: 12, title: "Nog maar iets", date: new Date("11/07/2022"), speakerId: "l" },
            { id: 13, title: "Ted talk 4", date: new Date("11/07/2022"), speakerId: "m" },
            { id: 14, title: "Fast and the Gaming", date: new Date("11/07/2022"), speakerId: "n" },
            { id: 15, title: "????", date: new Date("11/07/2022"), speakerId: "o" },
            { id: 16, title: "Nog maar eens iets", date: new Date("09/28/022"), speakerId: "p" },
            { id: 17, title: "Ted talk 5", date: new Date("08/24/022"), speakerId: "q" },
            { id: 18, title: "To fast to Gaming", date: new Date("08/24/022"), speakerId: "r" },
            { id: 19, title: "?????", date: new Date("10/07/2022"), speakerId: "s" },
            { id: 20, title: "Ook nog maar eens iets", date: new Date("10/07/2022"), speakerId: "t" },]
    })
} 