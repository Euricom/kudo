import { type NextApiRequest, type NextApiResponse } from "next";
import { getImageById } from "~/server/services/userService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    const image = await getImageById(id?.toString() ?? "")
    if (!image) {
        return
    }

    res.send({
        dataUrl:
            `data:${image?.headers.get('content-type') ?? ""};base64,` +
            Buffer.from(await image.arrayBuffer()).toString('base64'),
    });
    res.end();
}
