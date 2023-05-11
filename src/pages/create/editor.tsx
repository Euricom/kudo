import React, { useEffect, useState } from "react";
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
import type Konva from "konva";
import LoadingBar from "~/components/LoadingBar";
import { BsEyedropper, BsFillCircleFill } from "react-icons/bs";
import { EditorFunctions, type EmojiObject, Fonts, UserRole } from "~/types";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toast } from "react-toastify";
import { type TRPCError } from "@trpc/server";
import { type Kudo } from "@prisma/client";
import EditorButton from "~/components/editor/buttons/EditorButton";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import useEyeDropper from "use-eye-dropper";

export function getServerSideProps(context: {
  query: { template: string; session: string; anonymous: string };
}) {
  return {
    props: {
      id: context.query.template,
      sessionId: context.query.session,
      anonymous: context.query.anonymous,
    },
  };
}

const KonvaCanvas = dynamic(
  () => import("../../components/editor/KonvaCanvas"),
  { ssr: false }
);

const Editor: NextPage<{
  id: string;
  sessionId: string;
  anonymous: string;
}> = ({ id, sessionId, anonymous }) => {
  const router = useRouter();
  const width = useWindowDimensions()?.width;
  const user = useSession().data?.user;
  //UseStates
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>();
  const [stage, setStage] = useState<Konva.Stage>();
  const [emojiDropdownState, setEmojiDropdownState] = useState<boolean>(false);
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(100);
  const [lightness, setLightness] = useState<number>(50);
  const [color, setColor] = useState<string>("#000000");
  const { open } = useEyeDropper();
  const pickColor = async () => {
    if (width < 1024) {
      document.getElementById("Modal-" + EditorFunctions.Color)?.click();
    }
    await new Promise((res) => setTimeout(res, 100));
    open()
      .then((color) => {
        hexToHSL(color.sRGBHex);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [font, setFont] = useState<string>("Arial");
  const [thickness, setThickness] = useState<number>(5);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiObject>();
  //API
  const trpcContext = api.useContext();

  const { mutateAsync: createKudo } = api.kudos.createKudo.useMutation({
    //Nog nakijken of dit effectief iets doet
    onMutate: async (newEntry) => {
      await trpcContext.kudos.getKudosByUserId.cancel();

      trpcContext.kudos.getKudosByUserId.setData(
        { id: user?.id ?? "" },
        (prevEntries?: Kudo[]) => {
          const entry = {
            ...newEntry,
            id: "000000",
            liked: false,
            comment: "",
            flagged: false,
          };
          prevEntries?.push(entry);
          return prevEntries ?? [entry];
        }
      );
    },
    // Always refetch after error or success, so we have an up to date list
    onSettled: async () => {
      await trpcContext.kudos.getKudosByUserId.invalidate();
    },
  });
  const { mutateAsync: createImage } = api.kudos.createKudoImage.useMutation();
  const templateQuery = api.templates.getTemplateById.useQuery({ id: id });
  const template = templateQuery.data;
  const sessionQuery = api.sessions.getSessionById.useQuery({ id: sessionId });
  const session = sessionQuery.data;

  const volledigeSpeaker = api.users.getUserById.useQuery({
    id: /*session?.speakerId ?? */ "18d332af-2d5b-49e5-8c42-9168b3910f97",
  }).data;
  const slackMessage = api.slack.sendMessageToSlack.useMutation();
  const body = document.querySelector("body");
  function setHSL() {
    body?.style.setProperty("--hue", hue.toString());
    body?.style.setProperty("--sat", saturation.toString() + "%");
    body?.style.setProperty("--lig", lightness.toString() + "%");
  }

  setHSL();
  useEffect(() => {
    setColor(hslToHex(hue, saturation, lightness));
  }, [hue, saturation, lightness]);

  if (
    templateQuery.isLoading ||
    sessionQuery.isLoading ||
    !user ||
    !session ||
    !volledigeSpeaker ||
    !template
  ) {
    return <LoadingBar />;
  }

  const handleEmoji = () => {
    try {
      setEmojiDropdownState(!emojiDropdownState);
      setSelectedButton(EditorFunctions.PreSticker);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  function onClickEmoji(emoji: EmojiObject) {
    if (width < 1024) {
      document.getElementById("Modal-" + EditorFunctions.PreSticker)?.click();
    }
    setSelectedEmoji(emoji);
    setSelectedButton(EditorFunctions.PostSticker);
    setEmojiDropdownState(false);
  }

  const submit = async () => {
    if (EditorFunctions.Submit === selectedButton) {
      toast.warning("Kudo is being created, please wait.");
      return;
    }
    setSelectedButton(EditorFunctions.Submit);
    await new Promise((res) => setTimeout(res, 1000));
    if (!stage) {
      return;
    }
    if (user && user.id && user.name && volledigeSpeaker)
      try {
        const image = await createImage({
          dataUrl: stage.toDataURL({ pixelRatio: 1 / stage.scaleX() }),
        });
        await createKudo({
          image: image.id,
          sessionId: sessionId,
          userId: user.id,
          anonymous: anonymous === "true" ? true : false,
        });
        await slackMessage
          .mutateAsync({
            text: user.name.toString() + " heeft je een kudo gestuurd!",
            channel:
              "@" +
              volledigeSpeaker?.givenName +
              "." +
              volledigeSpeaker.surname.toLowerCase().replace(" ", ""),
          })
          .catch((e) => console.log(e));
        await router.replace("/out");
      } catch (e) {
        toast.error((e as TRPCError).message);
        setSelectedButton(EditorFunctions.None);
      }
  };
  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    const r = parseInt((result && result[1]) ?? "0", 16) / 255;
    const g = parseInt((result && result[2]) ?? "0", 16) / 255;
    const b = parseInt((result && result[3]) ?? "0", 16) / 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    setHue(60 * h < 0 ? 60 * h + 360 : 60 * h);
    setSaturation(
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)
    );
    setLightness((100 * (2 * l - s)) / 2);
  };

  return (
    <>
      <Head>
        <title>eKudo - Editor</title>
        <meta name="description" content="Editor to make a Kudo." />
      </Head>
      <NavigationBarContent>
        <h1>Editor: {session.title}</h1>
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

      {/* Main */}
      <main className="relative z-50 flex h-full flex-col items-center justify-center overflow-x-hidden">
        <div className="z-40 mx-auto flex w-full justify-center gap-2 p-5 lg:w-1/2">
          <EditorButton
            type={EditorFunctions.Text}
            icon={<BiText size={20} />}
            onClick={() => setSelectedButton(EditorFunctions.Text)}
            bgColor={selectedButton === EditorFunctions.Text ? color : ""}
          >
            <label className="label text-xs">Font</label>
            <select
              className="select-bordered select min-w-min max-w-xs"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              {Fonts.sort((a, b) => (b < a ? 1 : -1)).map((f) => (
                <option style={{ fontFamily: f }} key={f}>
                  {f}
                </option>
              ))}
            </select>
          </EditorButton>
          <EditorButton
            type={EditorFunctions.Draw}
            icon={
              selectedButton === EditorFunctions.Erase ? (
                <BiEraser size={20} />
              ) : (
                <BiPencil size={20} />
              )
            }
            onClick={() =>
              setSelectedButton(
                selectedButton == EditorFunctions.Erase
                  ? EditorFunctions.Erase
                  : EditorFunctions.Draw
              )
            }
            bgColor={
              selectedButton === EditorFunctions.Draw
                ? color
                : selectedButton === EditorFunctions.Erase
                ? "#00ff00"
                : ""
            }
          >
            <div className="w-40 text-xs">
              Thickness
              <input
                type="range"
                min="1"
                height={thickness}
                max="200"
                value={thickness}
                className="range"
                onChange={(e) => setThickness(parseInt(e.target.value))}
              />
            </div>
            <div className="mt-3 flex align-middle">
              <div className="flex flex-col justify-around">
                <BiPencil
                  size={30}
                  onClick={() => setSelectedButton(EditorFunctions.Draw)}
                />
                <BiEraser
                  size={30}
                  onClick={() => setSelectedButton(EditorFunctions.Erase)}
                />
              </div>
              <li className="pointer-events-none flex h-full flex-grow items-center justify-center p-2">
                {selectedButton == EditorFunctions.Erase ? (
                  <BiCircle size={5 + thickness * (stage?.scaleX() ?? 1)} />
                ) : (
                  <BsFillCircleFill
                    size={(1 + thickness) * (stage?.scaleX() ?? 1)}
                    color={color}
                  />
                )}
              </li>
            </div>
          </EditorButton>
          <EditorButton
            type={EditorFunctions.PreSticker}
            icon={<GrEmoji size={20} />}
            onClick={handleEmoji}
            bgColor={
              selectedButton == EditorFunctions.PreSticker ? "#00ff00" : ""
            }
          >
            <Picker data={data} onEmojiSelect={onClickEmoji} />
          </EditorButton>
          <EditorButton
            type={EditorFunctions.Color}
            icon={<BiPalette size={20} />}
            onClick={() => setSelectedButton(EditorFunctions.Color)}
            bgColor={color}
          >
            <div className="grid w-60 gap-2.5">
              <label className="label w-fit gap-4 text-xs">
                <h1 className="font-bold">Hue</h1>
                {hue}
              </label>
              <input
                onChange={(h) => {
                  void setHue(parseInt(h.target.value));
                  void setHSL();
                }}
                className="slider slider-h"
                type="range"
                id="h"
                name="h"
                min="0"
                max="360"
                value={hue}
              />
              <label className="label w-fit gap-4 text-xs">
                <h1 className="font-bold">Saturation</h1>
                {saturation}
              </label>
              <input
                onChange={(s) => {
                  void setSaturation(parseInt(s.target.value));
                  void setHSL();
                }}
                className="slider slider-s"
                type="range"
                id="s"
                name="s"
                min="0"
                max="100"
                value={saturation}
              />
              <label className="label w-fit gap-4 text-xs">
                <h1 className="font-bold">Lightness</h1>
                {lightness}
              </label>
              <input
                onChange={(l) => {
                  void setLightness(parseInt(l.target.value));
                  void setHSL();
                }}
                className="slider slider-l"
                type="range"
                id="l"
                name="l"
                min="0"
                max="100"
                value={lightness}
              />
              <div className="flex justify-end">
                <button
                  className="mt-2 rounded border border-gray-400 p-2"
                  onClick={() => void pickColor()}
                >
                  <BsEyedropper />
                </button>
              </div>
            </div>
            {/* <div className="slider-container flex w-60 flex-col gap-4 align-middle">
              <label className="label w-fit gap-4 text-xs">
                <h1 className="font-bold">Color</h1>
                {hue}
              </label>
              <input
                type="range"
                min="0"
                id="h"
                name="h"
                max="360"
                value={hue}
                onChange={(h) => void setHue(parseInt(h.target.value))}
                className="slider-h"
              />
              <label className="label w-fit gap-4 text-xs">
                <h1 className="font-bold">Saturation</h1>
                {saturation}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                id="s"
                name="s"
                value={saturation}
                onChange={(s) => void setSaturation(parseInt(s.target.value))}
                className="slider-s"
              />
              <label className="label w-fit gap-4 text-xs">
                <h1 className="font-bold">Brightness</h1>
                {lightness}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                id="l"
                name="l"
                value={lightness}
                onChange={(l) => void setLightness(parseInt(l.target.value))}
                className="slider-l"
              /> */}
            {/* <Slider-Color-Picker /> */}
            {/* <ChromePicker
                  color={color}
                  disableAlpha={true}
                  onChange={handleColorChange}
                  className="mt-2 h-full"
                /> */}
            {/* <ColorSlider defaultValue={color} channel="red" />
                <ColorSlider
                  channel={"hue"}
                  value={color}
                  onChange={(v) =>
                    void handleColorChange("#" + v.toHexInt().toString())
                  }
                />
                <ColorSlider
                  channel={"saturation"}
                  value={color}
                  onChange={(v) =>
                    void handleColorChange("#" + v.toHexInt().toString())
                  }
                />
                <ColorSlider
                  channel={"lightness"}
                  value={color}
                  onChange={(v) =>
                    void handleColorChange("#" + v.toHexInt().toString())
                  }
                />
                <ColorSlider
                  channel="alpha"
                  value={color}
                  onChange={(v) =>
                    void handleColorChange("#" + v.toHexInt().toString())
                  }
                /> */}
            {/* </div> */}
          </EditorButton>
          <EditorButton
            type={EditorFunctions.Undo}
            icon={<BiUndo size={20} />}
            onClick={() => setSelectedButton(EditorFunctions.Undo)}
            bgColor={selectedButton == EditorFunctions.Undo ? "#00ff00" : ""}
          />
          <EditorButton
            type={EditorFunctions.Clear}
            icon={<BiTrash size={20} />}
            onClick={() => setSelectedButton(EditorFunctions.Clear)}
            bgColor={selectedButton == EditorFunctions.Clear ? "#00ff00" : ""}
          />
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
          anonymous={anonymous === "true" ? true : false}
        />
      </main>
      <FAB text={"Send"} icon={<FiSend />} onClick={() => void submit()} />
    </>
  );
};

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default Editor;
