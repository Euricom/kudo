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
  AiOutlineSend,
  AiOutlineEdit,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserRole } from "~/types";
import { useRouter } from "next/router";
import LoadingBar from "~/components/LoadingBar";
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

  const [comment, setComment] = useState<string>("");
  const [editing, setEdit] = useState<boolean>(false);
  const kudoQuery = api.kudos.getKudoById.useQuery(
    { id: id },
    { onSuccess: (kudo) => setComment(kudo?.comment ?? "") }
  );
  const { data: kudo, refetch: refetchKudo } = kudoQuery;
  const senderQuery = api.users.getUserById.useQuery({
    id: kudo?.userId ?? "",
  });
  const sender = senderQuery.data;
  const imageQuery = api.kudos.getImageById.useQuery({
    id: kudo?.image ?? "error",
  });
  const image = imageQuery.data?.dataUrl;
  const sessionQuery = api.sessions.getSessionById.useQuery({
    id: kudo?.sessionId ?? "error",
  });
  const session = sessionQuery.data;
  const speaker = api.users.getUserByIds.useQuery({
    ids: session?.speakerId ?? [],
  }).data;

  const { mutate: deleteKudo } = api.kudos.deleteKudoById.useMutation();
  const { mutate: deleteImage } = api.kudos.deleteImageById.useMutation();
  const { mutateAsync: likeKudoById, isLoading: loadingLike } =
    api.kudos.likeKudoById.useMutation({
      onMutate: async (newEntry) => {
        await trpcContext.kudos.getKudoById.cancel();
        trpcContext.kudos.getKudoById.setData({ id: id }, (prevEntry) => {
          if (prevEntry) {
            prevEntry.liked = newEntry.liked;
          }
          return prevEntry;
        });
      },
      onSettled: async () => {
        await trpcContext.kudos.getKudoById.invalidate();
      },
    });
  const { mutateAsync: commentKudoById, isLoading: loadingComment } =
    api.kudos.commentKudoById.useMutation({
      onMutate: async (newEntry) => {
        await trpcContext.kudos.getKudoById.cancel();
        trpcContext.kudos.getKudoById.setData({ id: id }, (prevEntry) => {
          if (prevEntry) {
            prevEntry.comment = newEntry.comment;
          }
          return prevEntry;
        });
      },
      onSettled: async () => {
        await trpcContext.kudos.getKudoById.invalidate();
      },
    });
  const { mutateAsync: flagKudoById, isLoading: loadingFlag } =
    api.kudos.flagKudoById.useMutation({
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

  async function handleclick() {
    if (session?.speakerId.includes(user?.id ?? "") && kudo && kudo.id) {
      try {
        if (kudo.liked) {
          await likeKudoById({
            id: kudo.id,
            userId: user?.id ?? "",
            liked: !kudo.liked,
          });
        } else {
          await likeKudoById({
            id: kudo.id,
            userId: user?.id ?? "",
            liked: !kudo.liked,
          });
        }

        await refetchKudo();
      } catch (e) {
        toast.error((e as TRPCError).message);
      }
    }
  }

  async function handleSubmit() {
    if (session?.speakerId.includes(user?.id ?? "") && kudo && kudo.id) {
      try {
        setEdit(false);
        await commentKudoById({
          id: kudo.id,
          userId: user?.id ?? "",
          comment: comment,
        });
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
      !session?.speakerId.includes(user?.id)
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
    !sender ||
    imageQuery.isLoading ||
    sessionQuery.isLoading ||
    kudoQuery.isLoading ||
    senderQuery.isLoading
  ) {
    return <LoadingBar />;
  }

  function del() {
    deleteKudo({ id: kudo?.id ?? "error" });
    deleteImage({ id: kudo?.image ?? "error" });
  }

  async function flag() {
    if (
      session?.speakerId.includes(user?.id ?? "") &&
      kudo?.flagged === false
    ) {
      try {
        await flagKudoById({
          id: kudo?.id ?? "error",
          userId: user?.id ?? "error",
          flagged: !kudo?.flagged,
        });
      } catch (e) {
        toast.error((e as TRPCError).message);
      }
    } else if (/*user?.role === UserRole.ADMIN && */ kudo?.flagged === true) {
      try {
        await flagKudoById({
          id: kudo?.id ?? "error",
          userId: user?.id ?? "error",
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
          !session?.speakerId.includes(user?.id) && (
            <Link
              className="btn-ghost btn-circle btn"
              onClick={del}
              href="/out"
              data-cy="deleteButton"
            >
              <FaTrashAlt size={20} />
            </Link>
          )}
      </UtilButtonsContent>
      {/* <div className="flex justify-center ">
        <div className="card bg-white text-gray-800 aspect-[3/2] rounded-none w-[320px] h-[208px] mt-20">
          <Image className="shadow-2xl h-full w-full" src={image} fill alt="Kudo" />
        </div>
      </div> */}

      <div className=" flex h-full w-full flex-col items-center justify-center">
        <div className="max-h-full w-full max-w-2xl">
          <div className="flex justify-end">
            {(session?.speakerId.includes(user?.id ?? "") ||
              user?.role === UserRole.ADMIN) &&
              user?.id !== kudo?.userId && (
                <button
                  className="border-red relative m-2 mr-5"
                  onClick={() => void flag()}
                  data-cy="flagButton"
                  disabled={loadingFlag}
                >
                  {kudo.flagged ? (
                    <p className="text-error hover:underline">Reported!</p>
                  ) : (
                    <p className="text-warning hover:underline">
                      Report this Kudo
                    </p>
                  )}
                </button>
              )}
          </div>

          <div className="relative aspect-[3/2] max-h-full w-full max-w-2xl overflow-hidden rounded-3xl bg-white">
            <Image
              className="shadow-2xl"
              src={image}
              fill
              alt="Kudo"
              data-id={kudo.id}
            />
          </div>

          <div className="m-2 flex max-h-full w-full max-w-2xl items-center gap-2 px-3">
            <button
              className={`btn-ghost btn-circle btn ${
                session?.speakerId.includes(user?.id ?? "")
                  ? ""
                  : "pointer-events-none"
              }`}
              data-cy="like"
              onClick={() => void handleclick()}
              disabled={loadingLike}
            >
              {kudo.liked ? (
                <AiFillHeart
                  size={25}
                  className="fill-red-600"
                  data-cy="liked"
                />
              ) : (
                <AiOutlineHeart
                  size={25}
                  className="fill-red-600"
                  data-cy="notLiked"
                />
              )}
            </button>
            {(!kudo.comment || editing) &&
            session?.speakerId.includes(user?.id ?? "") ? (
              <div className="item relative flex w-full flex-row justify-start">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Type a comment"
                  className="input-bordered input w-full"
                  data-cy="commentInput"
                />
                <button
                  className="btn-ghost btn-circle btn absolute right-0"
                  data-cy="sendComment"
                  onClick={() => void handleSubmit()}
                  disabled={loadingComment}
                >
                  <AiOutlineSend size={20} />
                </button>
              </div>
            ) : (
              //Nog uitbreiden naar meerdere speakers
              <>
                {kudo.comment && !editing && (
                  <>
                    <div className="chat chat-end w-full">
                      <div className="chat-header flex flex-col">
                        {speaker?.map((s) => (
                          <a key={s.id}>{s.displayName}</a>
                        ))}
                      </div>
                      <h1
                        className="chat-bubble chat-bubble-primary flex gap-2"
                        data-cy="comment"
                      >
                        {comment}
                        <button
                          className="self-center"
                          onClick={() => setEdit(true)}
                        >
                          <AiOutlineEdit size={15} />
                        </button>
                      </h1>
                      <div className="chat-image avatar">
                        <div className="relative w-10 rounded-full">
                          <Image
                            className="rounded-full"
                            src={
                              "/api/images/" + (user?.id ?? "fout").toString()
                            }
                            alt="Profile picture"
                            fill
                          />
                        </div>
                      </div>
                    </div>
                  </>
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
