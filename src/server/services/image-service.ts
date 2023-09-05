import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env.mjs";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUDNAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export function uploadImage(base64: string) {
  return new Promise<string>((resolve, reject) => {
    void cloudinary.uploader.upload(base64, (err, res) => {
      if (err) reject(err);

      if (res) return resolve(res.secure_url);
      else reject("No error, but no url received either");
    });
  });
}
