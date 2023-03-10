import { type NextApiRequest, type NextApiResponse } from "next";
import { createKudo } from "~/server/services/kudoService";

type ResponseData = {
    result: any
}

interface RequestData {
    dataUrl: string;
}

export default async function handler(req: NextApiRequest , res: NextApiResponse<ResponseData>) {
    try {
        if (req.method === 'POST') {
            const { dataUrl } = req.body as RequestData;
            const result = await createKudo(dataUrl);
            res.status(200).json({ result });
        } else {
        //   getKudos()
        }
    } catch (e) {
        console.log(e);
    }
}