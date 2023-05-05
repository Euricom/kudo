import Image from "next/image";
import Link from "next/link";
import { type KudoProps } from "~/types";
import { api } from "~/utils/api";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const KudoCard = ({ kudo, isPresentation }: KudoProps) => {
  const imagesQuery = api.kudos.getImageById.useQuery({ id: kudo.image });
  const image = imagesQuery.data?.dataUrl;
  const userQuery = api.users.getUserById.useQuery({ id: kudo.userId });
  const user = userQuery.data?.displayName;

  if (imagesQuery.isLoading || userQuery.isLoading || !image || !user) {
    return <></>;
  }
  return (
    <>
      <div className="items-start">
        <Link
          className="card aspect-[3/2] h-52 w-80 items-center justify-end overflow-hidden rounded-xl bg-white text-gray-800 shadow-xl"
          data-cy="Kudo"
          data-id={kudo.id}
          href={"/kudo/" + kudo.id}
          id={kudo.sessionId}
        >
          {isPresentation ? (
            ""
          ) : kudo.liked ? (
            <div className="absolute left-1 top-1 z-40 rounded-full bg-white  p-1 drop-shadow-sm">
              <AiFillHeart
                size={25}
                className="fill-red-600"
                data-cy={kudo.id + "liked"}
              />
            </div>
          ) : (
            <div className="absolute left-1 top-1 z-40 rounded-full bg-white p-1 drop-shadow-sm">
              <AiOutlineHeart
                size={25}
                className="fill-red-600"
                data-cy={kudo.id + "notLiked"}
              />
            </div>
          )}
          <Image
            className="absolute z-30 h-full"
            src={image}
            width={320}
            height={208}
            alt="Kudo"
          />
        </Link>
      </div>
    </>
  );
};

export default KudoCard;
