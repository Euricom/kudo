import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { FaTrashAlt } from "react-icons/fa";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Link from "next/link";
import { api } from "~/utils/api";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillWarning,
  AiOutlineWarning,
  AiOutlineSend,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import ConfirmationModal from "~/components/input/ConfirmationModal";
import { useSession } from "next-auth/react";
import { type ImageData, UserRole } from "~/types";
import { useRouter } from "next/router";
import LoadingBar from "~/components/LoadingBar";
import avatar from "~/../public/images/AnonymousPicture.jpg";
import { toast } from "react-toastify";
import { type TRPCError } from "@trpc/server";

export function getServerSideProps(context: { query: { id: string } }) {
  return {
    props: {
      id: context.query.id[0],
    },
  };
}

const KudoDetail: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const trpcContext = api.useContext();
  const user = useSession().data?.user;

  const kudoQuery = api.kudos.getKudoById.useQuery({ id: id });
  const { data: kudo, refetch: refetchKudo } = kudoQuery;
  const sender = api.users.getUserById.useQuery({
    id: kudo?.userId ?? "",
  }).data;
  const imageQuery = api.kudos.getImageById.useQuery({
    id: kudo?.image ?? "error",
  });
  const image = imageQuery.data?.dataUrl;
  const sessionQuery = api.sessions.getSessionById.useQuery({
    id: kudo?.sessionId ?? "error",
  });
  const session = sessionQuery.data;
  const speaker = api.users.getUserById.useQuery({
    id: session?.speakerId ?? "error",
  }).data;

  const { mutate: deleteKudo } = api.kudos.deleteKudoById.useMutation();
  const { mutate: deleteImage } = api.kudos.deleteImageById.useMutation();
  const { mutateAsync: likeKudoById } = api.kudos.likeKudoById.useMutation();
  const { mutateAsync: commentKudoById } =
    api.kudos.commentKudoById.useMutation();
  const { mutateAsync: flagKudoById } = api.kudos.flagKudoById.useMutation({
    onMutate: async (newEntry) => {
      await trpcContext.kudos.getKudoById.cancel();
      trpcContext.kudos.getKudoById.setData({ id: id }, (prevEntry) => {
        if (prevEntry) {
          prevEntry.flagged = newEntry.flagged;
        }
        return prevEntry;
      });
    },
    onSettled: async () => {
      await trpcContext.kudos.getKudoById.invalidate();
    },
  });
  const [comment, setComment] = useState<string>("");
  const [sendReady, setSendReady] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>(avatar.src);

  useEffect(() => {
    if (kudo?.userId && speaker?.id)
      fetch("/api/images/" + speaker?.id.toString())
        .then((res) => res.json())
        .then((json: ImageData) => setImgUrl(json.dataUrl))
        .catch((e: Error) => toast.error(e.message));
  }, [kudo?.userId, speaker?.id]);

  async function handleclick() {
    if (user?.id === session?.speakerId && kudo && kudo.id) {
      try {
        if (kudo.liked) {
          await likeKudoById({
            id: kudo.id,
            liked: !kudo.liked,
          });
        } else {
          await likeKudoById({ id: kudo.id, liked: !kudo.liked });
        }

        await refetchKudo();
      } catch (e) {
        toast.error((e as TRPCError).message);
      }
    }
  }

  async function handleSubmit() {
    if (user?.id === session?.speakerId && kudo && kudo.id) {
      try {
        await commentKudoById({
          id: kudo.id,
          comment: comment,
        });
        setSendReady(false);
        setComment("");
        await refetchKudo();
      } catch (e) {
        toast.error((e as TRPCError).message);
      }
    }
  }
  useEffect(() => {
    if (!user || sessionQuery.isLoading || kudoQuery.isLoading) return;
    if (
      user?.role !== UserRole.ADMIN &&
      user?.id !== kudo?.userId &&
      user?.id !== session?.speakerId
    )
      router.replace("/403").catch(toast.error);
  }, [
    user,
    router,
    kudo?.userId,
    session?.speakerId,
    sessionQuery.isLoading,
    kudoQuery.isLoading,
  ]);

  if (
    !image ||
    !kudo ||
    !session ||
    imageQuery.isLoading ||
    sessionQuery.isLoading ||
    kudoQuery.isLoading
  ) {
    return <LoadingBar />;
  }

  function del() {
    deleteKudo({ id: kudo?.id ?? "error" });
    deleteImage({ id: kudo?.image ?? "error" });
  }

  async function flag() {
    toast.error("er is geflagd");
    console.log("test1");
    if (user?.id === session?.speakerId && kudo?.flagged === false) {
      try {
        await flagKudoById({
          id: kudo?.id ?? "error",
          flagged: !kudo?.flagged,
        });
      } catch (e) {
        toast.error((e as TRPCError).message);
        console.log("test2");
      }
    } else if (/*user?.role === UserRole.ADMIN && */ kudo?.flagged === true) {
      try {
        await flagKudoById({
          id: kudo?.id ?? "error",
          flagged: !kudo?.flagged,
        });
      } catch (e) {
        toast.error((e as TRPCError).message);
      }
      await refetchKudo();
    }
  }

  return (
    <>
      <Head>
        <title>eKudo - Kudo</title>
        <meta
          name="description"
          content="Page where you can see a Kudo in detail."
        />
      </Head>
      <NavigationBarContent>
        Kudo for: {session?.title ?? "No title"}
      </NavigationBarContent>
      <UtilButtonsContent>
        {(user?.id === kudo?.userId || user?.role === UserRole.ADMIN) &&
          user?.id !== session?.speakerId && (
            <Link
              className="btn-ghost btn-circle btn"
              onClick={del}
              href="/out"
              data-cy="deleteButton"
            >
              <FaTrashAlt size={20} />
            </Link>
          )}
        {(user?.id === session?.speakerId || user?.role === UserRole.ADMIN) &&
          user?.id !== kudo?.userId && (
            <button
              className="btn-ghost btn-circle btn"
              onClick={() => void flag()}
              data-cy="flagButton"
            >
              {kudo.flagged ? (
                <AiFillWarning size={20} />
              ) : (
                <AiOutlineWarning size={20} />
              )}
            </button>
          )}
      </UtilButtonsContent>
      {/* <div className="flex justify-center ">
        <div className="card bg-white text-gray-800 aspect-[3/2] rounded-none w-[320px] h-[208px] mt-20">
          <Image className="shadow-2xl h-full w-full" src={image} fill alt="Kudo" />
        </div>
      </div> */}

      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="aspect-[3/2] max-h-full w-full max-w-2xl">
          <div className="relative aspect-[3/2] max-h-full w-full max-w-2xl overflow-hidden rounded-3xl bg-white">
            <Image
              className="shadow-2xl"
              src={image}
              fill
              alt="Kudo"
              data-id={kudo.id}
            />
          </div>
          <div className="m-2 flex flex-row gap-2">
            <div
              className={`btn-ghost btn-circle btn ${
                user?.id === session?.speakerId ? "" : "pointer-events-none"
              }`}
              data-cy="like"
              onClick={() => void handleclick()}
            >
              {kudo.liked ? (
                <AiFillHeart size={25} data-cy="liked" />
              ) : (
                <AiOutlineHeart size={25} data-cy="notLiked" />
              )}
            </div>
            {!kudo.comment && user?.id === session?.speakerId ? (
              <div className="item relative flex w-full flex-row justify-start">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="place your comment here"
                  className="input-bordered input w-full"
                  data-cy="commentInput"
                />
                <div
                  className="btn-ghost btn-circle btn absolute right-0"
                  data-cy="sendComment"
                  onClick={() => void handleSubmit()}
                >
                  <AiOutlineSend size={20} />
                </div>
              </div>
            ) : (
              <>
                {!kudo.comment ? (
                  <></>
                ) : (
                  <div className="chat chat-end w-full">
                    <div className="chat-header">{speaker?.displayName}</div>
                    <h1
                      className="chat-bubble chat-bubble-primary"
                      data-cy="comment"
                    >
                      {kudo.comment}
                    </h1>
                    <div className="chat-image avatar">
                      <div className="relative w-10 rounded-full">
                        <Image
                          className="rounded-full"
                          src={imgUrl}
                          alt="Profile picture"
                          fill
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KudoDetail;
