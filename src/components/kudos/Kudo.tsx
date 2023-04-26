import Image from "next/image";
import Link from "next/link";
import { type KudoProps } from "~/types";
import { api } from "~/utils/api";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const KudoCard = ({ kudo, isPresentation }: KudoProps) => {
  const image = api.kudos.getImageById.useQuery({ id: kudo.image }).data
    ?.dataUrl;
  const user = api.users.getUserById.useQuery({ id: kudo.userId }).data
    ?.displayName;

  if (!image || !user) {
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
          <Image
            className="absolute h-full"
            src={image}
            width={320}
            height={208}
            alt="Kudo"
          />
          {kudo.anonymous ? (
            <></>
          ) : (
            <h1 className="relative">Sent by {user}</h1>
          )}
        </Link>
        {isPresentation ? (
          ""
        ) : kudo.liked ? (
          <AiFillHeart size={25} data-cy={kudo.id + "liked"} />
        ) : (
          <AiOutlineHeart size={25} data-cy={kudo.id + "notLiked"} />
        )}
      </div>
    </>
  );
};

export default KudoCard;
