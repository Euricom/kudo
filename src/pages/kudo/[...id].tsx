import { type Kudo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { FaTrashAlt } from "react-icons/fa";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Link from "next/link";
import { api } from "~/utils/api";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useState } from "react";


export function getServerSideProps(context: { query: { id: string }; }) {

  return {
    props: {
      id: context.query.id[0],
    }
  }
}

const KudoDetail: NextPage<{ id: string }> = ({ id }) => {


  const deleteKudo = api.kudos.deleteKudoById.useMutation()
  const deleteImage = api.kudos.deleteImageById.useMutation()
  const likeKudoById = api.kudos.LikeKudoById.useMutation()


  const kudo: Kudo | null | undefined = api.kudos.getKudoById.useQuery({ id: id }).data
  const image: string | undefined = api.kudos.getImageById.useQuery({ id: kudo?.image ?? "error" }).data?.dataUrl
  const [liked, setLiked] = useState<boolean>(kudo?.liked ?? false)


  function handleclick() {
    try {
      likeKudoById.mutate({ id: kudo?.id ?? "error", liked: !liked })
      setLiked(!liked)
    }
    catch (e) {
      console.log(e);
    }
  }

  if (!image || !kudo) {
    return <div>loading...</div>
  }

  function del() {
    deleteKudo.mutate({ id: kudo?.id ?? "error" })
    deleteImage.mutate({ id: kudo?.image ?? "error" })
  }



  return (
    <>
      <NavigationBarContent>
        <h1>Kudo {kudo.sessionId}</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <Link className="btn btn-ghost btn-circle" onClick={del} href="/out" data-cy="deleteButton">
          <FaTrashAlt size={20} />
        </Link>
      </UtilButtonsContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="flex justify-center ">
        <div className="card bg-white text-gray-800 aspect-[3/2] rounded-none w-[320px] h-[208px] mt-20">
          <Image className="shadow-2xl h-full w-full" src={image} fill alt="Kudo" />
        </div>
      </div> */}

      <div className="flex flex-col  justify-center h-full">

        <div className="aspect-[3/2] w-full items-center max-h-full max-w-4xl bg-white relative">
          <Image className="shadow-2xl" src={image} fill alt="Kudo" />
        </div>
        <div className="btn btn-square btn-ghost " data-cy="Like" onClick={handleclick}>
          {liked ? <AiFillHeart size={25} /> : <AiOutlineHeart size={25} />}
        </div>
      </div>

    </>
  );
};

export default KudoDetail;

