import { type NextApiRequest, type NextApiResponse } from "next";
import { getToken } from "~/server/services/userService";

const getImageById = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    if (!id) {
        return
    }

    const options = await getToken()
    const imageRes = await fetch('https://graph.microsoft.com/v1.0/users/' + id.toString() + '/photo/$value', options);

    res.send({
        dataUrl:
            `data:${imageRes.headers.get('content-type') ?? ""};base64,` +
            Buffer.from(await imageRes.arrayBuffer()).toString('base64'),
    });
    res.end();

};

export default getImageById