import { type Kudo } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";

//Voorlopig adhv card, moet Image worden naar de toekomst toe


interface KudoProps {
  kudo: Kudo
}


const KudoCard = ({ kudo }: KudoProps) => {
  const image = api.kudos.getImageById.useQuery({ id: kudo.image }).data?.dataUrl
  const user = api.users.getUserById.useQuery({ id: kudo.userId }).data?.displayName


  if (!image || !user) {
    return <></>
  }
  return (
    <>
      <Link className="card bg-white text-gray-800 justify-end items-center shadow-xl aspect-[3/2] rounded-none w-80 h-52" data-cy="Kudo" href={"/kudo/" + kudo.id} id={kudo.sessionId}>

        <Image className="absolute h-full" src={image} width={320} height={208} alt="Kudo" />
        {kudo.anonymous ? <></> : <h1 className="relative">Sent by {user}</h1>}
      </Link>
    </>
  );
};

export default KudoCard;

