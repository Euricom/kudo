import { type NextApiRequest, type NextApiResponse } from "next";
import { createKudo } from "~/server/services/kudoService";

type ResponseData = {
    result: unknown
}

interface RequestData {
    dataUrl: string;
    sessionId: string;
    userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        if (req.method === 'POST') {
            const { dataUrl, sessionId, userId } = req.body as RequestData;
            const result = await createKudo(dataUrl, sessionId, userId);
            res.status(200).json({ result });
        } else {
            //   getKudos()
        }
    } catch (e) {
        console.log(e);
    }
}