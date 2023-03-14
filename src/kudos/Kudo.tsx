import { Kudo } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FcPodiumWithSpeaker } from "react-icons/fc"
import { trpc } from "~/utils/trpc";

//Voorlopig adhv card, moet Image worden naar de toekomst toe


interface KudoProps {
  kudo: Kudo
}


const KudoCard = ({ kudo }: KudoProps) => {
  const image = trpc.kudos.getImageById.useQuery({ id: kudo.image }).data?.dataUrl
  if (!image) {
    return <></>
  }
  return (
    <>
      <Link className="card bg-white text-gray-800 shadow-xl aspect-[3/2] rounded-none w-80 h-52" data-cy="Kudo" href={"/kudo/" + kudo.id}>

        <Image src={image} width={80} height={52} alt="Kudo" />
      </Link>
    </>
  );
};

export default KudoCard;

