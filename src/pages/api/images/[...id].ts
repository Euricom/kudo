import { type NextApiRequest, type NextApiResponse } from "next";
import { getImageById } from "~/server/services/userService";
import { Readable, pipeline } from "stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const image = await getImageById(id?.toString() ?? "");
  if (!image) {
    return;
  }
  await pipeImageToResponse(res, image);
}

const pipeImageToResponse = async (
  res: NextApiResponse,
  imageResponse: Response
) => {
  const content = imageResponse.headers.get("Content-Type");
  if (!content) {
    return;
  }
  res.setHeader("content-type", content);

  pipeline(
    Readable.from(new Buffer(await imageResponse.arrayBuffer())),
    res,
    (error) => {
      if (error) console.error(error);
    }
  );
};
