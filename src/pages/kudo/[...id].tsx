import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { FaTrashAlt } from "react-icons/fa";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Link from "next/link";
import { api } from "~/utils/api";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import ConfirmationModal from '~/components/input/ConfirmationModal';
import { useSession } from "next-auth/react";
import { UserRole } from "~/types";
import { useRouter } from "next/router";


export function getServerSideProps(context: { query: { id: string }; }) {

  return {
    props: {
      id: context.query.id[0],
    }
  }
}

const KudoDetail: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter()
  const user = useSession().data?.user

  const deleteKudo = api.kudos.deleteKudoById.useMutation()
  const deleteImage = api.kudos.deleteImageById.useMutation()
  const likeKudoById = api.kudos.likeKudoById.useMutation()
  const commentKudoById = api.kudos.commentKudoById.useMutation()

  const { data: kudo, refetch: refetchKudo } = api.kudos.getKudoById.useQuery({ id: id })
  const image: string | undefined = api.kudos.getImageById.useQuery({ id: kudo?.image ?? "error" }).data?.dataUrl
  const session = api.sessions.getSessionById.useQuery({ id: kudo?.sessionId ?? "error" }).data
  const [comment, setComment] = useState<string>("")
  const [sendReady, setSendReady] = useState<boolean>(false)

  async function handleclick() {
    if (user?.id === session?.speakerId) {
      try {
        await likeKudoById.mutateAsync({ id: kudo?.id ?? "error", liked: !kudo?.liked })
        await refetchKudo()
      }
      catch (e) {
        console.log(e);
      }
    }
  }

  async function handleSubmit() {
    try {
      await commentKudoById.mutateAsync({ id: kudo?.id ?? "error", comment: comment })
      setSendReady(false)
      setComment("")
      await refetchKudo()
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if(!user) return
    if(user?.role !== UserRole.ADMIN && user?.id !== kudo?.userId && user?.id !== session?.speakerId) 
      router.replace("/403").catch(console.error)
  }, [user, router, kudo?.userId, session?.speakerId])

  if (!image || !kudo) {
    return <div>loading...</div>
  }


  function del() {
    deleteKudo.mutate({ id: kudo?.id ?? "error" })
    deleteImage.mutate({ id: kudo?.image ?? "error" })
  }


  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <h1>Kudo {session?.title ?? "no title"}</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        {((user?.id === kudo?.userId || user?.role === UserRole.ADMIN) && user?.id !== session?.speakerId) && 
          <Link className="btn btn-ghost btn-circle" onClick={del} href="/out" data-cy="deleteButton">
            <FaTrashAlt size={20} />
          </Link>
        }
      </UtilButtonsContent>
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
            <div className={`btn btn-circle btn-ghost ${user?.id === session?.speakerId?"":"pointer-events-none"}`} data-cy="Like" onClick={() => void handleclick()}>
              {kudo.liked ? <AiFillHeart size={25} /> : <AiOutlineHeart size={25} />}
            </div>
            {!kudo.comment && user?.id === session?.speakerId?
              <div className="flex flex-row left justify-end w-fit">
                <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="place your comment here" className="input input-bordered max-w-xs w-full" data-cy="comment" />
                <div className="btn btn-circle btn-ghost mt-2" onClick={() => setSendReady(true)}>
                  <FiSend size={20} />
                </div>
              </div>
              :
              <div className="h-full w-full pt-3">
                <h1 >{kudo.comment}</h1>
              </div>
            }
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

