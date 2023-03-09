import Link from "next/link";
import { FcPodiumWithSpeaker } from "react-icons/fc"

//Voorlopig adhv card, moet Image worden naar de toekomst toe


interface KudoProps {
  id: number
}


const Kudo = ({ id }: KudoProps) => {
  return (
    <>
      <Link className="card bg-white text-gray-800 shadow-xl aspect-[3/2] rounded-none" data-cy="Kudo" href={"/kudo/" + id.toString()}>
        <div className="card-body p-0">
          <h2 className="card-title bg-red-500 justify-center p-4">Thank you!</h2>
          <div className="flex p-8">
            <figure>
              <FcPodiumWithSpeaker size={100} />
            </figure>
            <p>This lecture was really enjoyable.</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Kudo;

