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
import { FiSend } from "react-icons/fi";
import ConfirmationModal from '~/input/ConfirmationModel';


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
  const likeKudoById = api.kudos.likeKudoById.useMutation()
  const commentKudoById = api.kudos.commentKudoById.useMutation()



  const kudo: Kudo | null | undefined = api.kudos.getKudoById.useQuery({ id: id }).data
  const image: string | undefined = api.kudos.getImageById.useQuery({ id: kudo?.image ?? "error" }).data?.dataUrl
  const session = api.sessions.getSessionById.useQuery({ id: kudo?.sessionId ?? "error" }).data
  const [liked, setLiked] = useState<boolean>(() => {
    const storedLiked = localStorage.getItem(`kudo:${kudo?.id ?? "error"}:liked`);
    return storedLiked ? JSON.parse(storedLiked) as boolean : kudo?.liked ?? false;
  });
  const [comment, setComment] = useState<string>("")
  const [existingComment, setExistingComment] = useState<string | undefined>(kudo?.comment)
  const [sendReady, setSendReady] = useState<boolean>(false)




  function handleclick() {
    try {
      likeKudoById.mutate({ id: kudo?.id ?? "error", liked: !liked })
      setLiked(!liked)
      localStorage.setItem(`kudo:${kudo?.id ?? "error"}:liked`, JSON.stringify(!liked));
      //     kudo?.liked = liked

    }
    catch (e) {
      console.log(e);
    }
  }

  function handleSubmit() {
    try {
      commentKudoById.mutate({ id: kudo?.id ?? "error", comment: comment })
      setSendReady(false)
      setComment("")
      setExistingComment(comment)
      //    kudo?.comment = comment
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
        <h1>Kudo {session?.title ?? "no title"}</h1>
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

      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="aspect-[3/2] w-full max-h-full max-w-2xl">
          <div className="aspect-[3/2] w-full max-h-full max-w-2xl bg-white relative">
            <Image className="shadow-2xl" src={image} fill alt="Kudo" />
          </div>
          <div className="flex flex-row left-0 mt-2 gap-5 md:gap-10 ">
            <div className="btn btn-circle btn-ghost" data-cy="Like" onClick={() => handleclick()}>
              {liked ? <AiFillHeart size={25} /> : <AiOutlineHeart size={25} />}
            </div>
            {existingComment ?
              <div className="h-full w-full pt-3">
                <h1 >{existingComment}</h1></div>
              : <div className="flex flex-row left justify-end w-fit">
                <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="place your comment here" className="input input-bordered max-w-xs w-full" data-cy="comment" />
                <div className="btn btn-circle btn-ghost mt-2" onClick={() => setSendReady(true)}>
                  <FiSend size={20} />
                </div>
              </div>}
          </div>
        </div>
      </div>

      {
        sendReady ?
          <ConfirmationModal
            prompt={"Is your comment ready to be sent?"}
            onCancel={() => setSendReady(false)}
            cancelLabel={"No"}
            onSubmit={() => void handleSubmit()}
            submitLabel={"Yes"}
          /> : <></>
      }

    </>
  );
};

export default KudoDetail;

