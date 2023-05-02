import React, { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr";
import {
  BiPencil,
  BiPalette,
  BiText,
  BiTrash,
  BiEraser,
  BiCircle,
  BiUndo,
} from "react-icons/bi";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import FAB from "~/components/navigation/FAB";
import { FiSave, FiSend } from "react-icons/fi";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useSessionSpeaker } from "~/components/sessions/SelectedSessionAndSpeaker";
import type Konva from "konva";
import ConfirmationModal from "~/components/input/ConfirmationModal";
import LoadingBar from "~/components/LoadingBar";
import { BsFillCircleFill } from "react-icons/bs";
import { type ColorResult, HuePicker } from "react-color";
import { EditorFunctions, type EmojiObject, Fonts, UserRole } from "~/types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from "react-toastify";
import { type TRPCError } from "@trpc/server";

export function getServerSideProps(context: { query: { template: string } }) {
  return {
    props: {
      id: context.query.template,
    },
  };
}

const KonvaCanvas = dynamic(
  () => import("../../components/editor/KonvaCanvas"),
  { ssr: false }
);

const Editor: NextPage<{ id: string }> = ({ id }) => {
  const { session, speaker, anonymous } = useSessionSpeaker().data;
  const router = useRouter();
  const user = useSession().data?.user;
  //API
  const { mutateAsync: createKudo } = api.kudos.createKudo.useMutation();
  const { mutateAsync: createImage } = api.kudos.createKudoImage.useMutation();
  const templateQuery = api.templates.getTemplateById.useQuery({ id: id });
  const template = templateQuery.data;
  //UseStates
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>();
  const [stage, setStage] = useState<Konva.Stage>();
  const [emojiDropdownState, setEmojiDropdownState] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#121212");
  const [font, setFont] = useState<string>("Arial");
  const [thickness, setThickness] = useState<number>(5);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiObject>();

  if (templateQuery.isLoading || !user || !session || !speaker || !template) {
    return <LoadingBar />;
  }

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex);
  };

  const handleEmoji = () => {
    setEmojiDropdownState(!emojiDropdownState);
    setSelectedButton(EditorFunctions.Sticker);
  };

  function onClickEmoji(emoji: EmojiObject) {
    setSelectedEmoji(emoji);
    setEmojiDropdownState(false);
  }

  const submit = async () => {
    setSelectedButton(EditorFunctions.None);
    if (!stage) {
      return;
    }
    if (user && user.id)
      try {
        const image = await createImage({
          dataUrl: stage.toDataURL({ pixelRatio: 1 / stage.scaleX() }),
        });
        await createKudo({
          image: image.id,
          sessionId: session,
          userId: user.id,
          anonymous: anonymous,
        });
        await router.replace("/out");
      } catch (e) {
        toast.error((e as TRPCError).message);
      }
  };

  return (
    <>
      <Head>
        <title>eKudo - Editor</title>
        <meta name="description" content="Editor to make a Kudo." />
      </Head>
      <NavigationBarContent>
        <h1>Editor</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        {user?.role === UserRole.ADMIN && (
          <button
            className="btn-ghost btn-circle btn "
            onClick={() => void setSelectedButton(EditorFunctions.Save)}
            data-cy="SaveButton"
          >
            <FiSave size={20} />
          </button>
        )}
      </UtilButtonsContent>
      {/* <div className="w-full h-fit bg-secondary text-white p-5 text-center">
        <h1 data-cy="session" className="lg:inline">&emsp;&emsp;&emsp;&emsp;Session: {sessionId}&emsp;&emsp;</h1><h1 data-cy="speaker" className="lg:inline"> Speaker: {speaker}</h1>
      </div> */}

      {selectedButton === EditorFunctions.Submit && (
        <ConfirmationModal
          prompt={"Is your Kudo ready to be sent?"}
          onCancel={() => setSelectedButton(EditorFunctions.None)}
          cancelLabel={"No"}
          onSubmit={() => void submit()}
          submitLabel={"Yes"}
        />
      )}
      {/* Main */}
      <main className="relative z-50 flex h-full flex-col items-center justify-center overflow-x-hidden">
        <div className="z-40 mx-auto flex w-full justify-center gap-2 p-5 lg:w-1/2">
          <div className="dropdown-start dropdown ">
            <label tabIndex={0} className="">
              <button
                onClick={() => setSelectedButton(EditorFunctions.Text)}
                className={"btn-secondary btn-circle btn "}
                style={{
                  backgroundColor:
                    selectedButton === EditorFunctions.Text ? color : "",
                }}
              >
                <BiText size={20} />{" "}
              </button>
            </label>
            <ul
              tabIndex={0}
              className=" dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <label className="label text-xs">Font</label>
              <select
                className="select-bordered select w-full max-w-xs"
                value={font}
                onChange={(e) => setFont(e.target.value)}
              >
                {Fonts.sort((a, b) => (b < a ? 1 : -1)).map((f) => (
                  <option style={{ fontFamily: f }} key={f}>
                    {f}
                  </option>
                ))}
              </select>
            </ul>
          </div>
          <div className="dropdown-start dropdown">
            <label tabIndex={0} className="">
              <button
                onClick={() =>
                  setSelectedButton(
                    selectedButton == EditorFunctions.Erase
                      ? EditorFunctions.Erase
                      : EditorFunctions.Draw
                  )
                }
                className={
                  "btn-secondary btn-circle btn " +
                  (selectedButton === EditorFunctions.Erase ? "btn-accent" : "")
                }
                style={{
                  backgroundColor:
                    selectedButton === EditorFunctions.Draw ? color : "",
                }}
              >
                {selectedButton === EditorFunctions.Erase ? (
                  <BiEraser size={20} />
                ) : (
                  <BiPencil size={20} />
                )}
              </button>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <div className="flex w-full items-center">
                <div>
                  <li>
                    <BiPencil
                      size={50}
                      onClick={() => setSelectedButton(EditorFunctions.Draw)}
                    />
                  </li>
                  <li>
                    <BiEraser
                      size={50}
                      onClick={() => setSelectedButton(EditorFunctions.Erase)}
                    />
                  </li>
                </div>
                <li className="pointer-events-none h-full w-full flex-auto items-center">
                  {selectedButton == EditorFunctions.Erase ? (
                    <BiCircle size={40 + thickness} />
                  ) : (
                    <BsFillCircleFill size={33 + thickness} color={color} />
                  )}
                </li>
              </div>
              <li>
                <div className="text-xs">
                  Thickness
                  <input
                    type="range"
                    min="1"
                    height={thickness}
                    max="50"
                    value={thickness}
                    className="range"
                    onChange={(e) => setThickness(parseInt(e.target.value))}
                  />
                </div>
              </li>
            </ul>
          </div>
          <div className="dropdown-start dropdown">
            <label tabIndex={0} className="">
              <button
                onClick={handleEmoji}
                className={
                  "btn-secondary btn-circle btn " +
                  (selectedButton == EditorFunctions.Sticker
                    ? "btn-accent"
                    : "")
                }
              >
                {selectedEmoji ? (
                  <>{selectedEmoji.native}</>
                ) : (
                  <GrEmoji size={20} />
                )}
              </button>
            </label>
            {emojiDropdownState && (
              <ul tabIndex={0} className="dropdown-content ">
                <Picker data={data} onEmojiSelect={onClickEmoji} />
              </ul>
            )}
          </div>
          <div className="dropdown-start dropdown ">
            <label tabIndex={0} className="">
              <button
                onClick={() => setSelectedButton(EditorFunctions.Color)}
                className={"btn-secondary btn-circle btn "}
                style={{
                  backgroundColor: color,
                }}
              >
                <BiPalette size={20} />
              </button>
            </label>
            <ul
              tabIndex={0}
              className=" dropdown-content ml-5 w-80 -translate-x-2/3 rounded-full bg-secondary p-2 lg:w-fit lg:translate-x-0"
            >
              <li className="flex gap-4 align-middle">
                <BsFillCircleFill
                  size={16}
                  onClick={() => setColor("#121212")}
                  color={"#121212"}
                />
                <HuePicker color={color} onChange={handleColorChange} />
              </li>
            </ul>
          </div>
          <button
            onClick={() => setSelectedButton(EditorFunctions.Undo)}
            className={
              "btn-secondary btn-circle btn" +
              (selectedButton == EditorFunctions.Undo ? "btn-accent" : "")
            }
          >
            <BiUndo size={20} />
          </button>
          <button
            onClick={() => setSelectedButton(EditorFunctions.Clear)}
            className={
              "btn-secondary btn-circle btn " +
              (selectedButton == EditorFunctions.Clear ? "btn-accent" : "")
            }
          >
            <BiTrash size={20} />
          </button>
        </div>
        <div data-cy={template.id}></div>
        <KonvaCanvas
          editorFunction={selectedButton}
          template={template}
          thickness={thickness}
          color={color}
          fontFamily={font}
          setFunction={setSelectedButton}
          setStage={setStage}
          emoji={selectedEmoji}
        />
      </main>
      <FAB
        text={"Send"}
        icon={<FiSend />}
        onClick={() => setSelectedButton(EditorFunctions.Submit)}
      />
    </>
  );
};

export default Editor;
