import React, { useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash, BiEraser, BiCircle, BiUndo } from "react-icons/bi"
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import FAB from "~/components/navigation/FAB";
import { FiSave, FiSend } from "react-icons/fi"
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useSessionSpeaker } from '~/components/sessions/SelectedSessionAndSpeaker';
import type Konva from 'konva';
import ConfirmationModal from '~/components/input/ConfirmationModal';
import LoadingBar from '~/components/LoadingBar';
import { BsFillCircleFill } from 'react-icons/bs';
import { type ColorResult, HuePicker } from 'react-color';
import { EditorFunctions, type EmojiObject, Fonts, UserRole } from '~/types';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export function getServerSideProps(context: { query: { template: string; }; }) {
  return {
    props: {
      id: context.query.template,
    }
  }
}

const KonvaCanvas = dynamic(
  () => import('../../components/editor/KonvaCanvas'),
  { ssr: false }
);

const Editor: NextPage<{ id: string }> = ({ id }) => {
  const res = api.templates.getTemplateById.useQuery({ id: id }).data
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>()
  const [stage, setStage] = useState<Konva.Stage>()
  const createKudo = api.kudos.createKudo.useMutation()
  const createImage = api.kudos.createKudoImage.useMutation()
  const router = useRouter()
  const [emojiDropdownState, setEmojiDropdownState] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#121212");
  const [font, setFont] = useState<string>("Arial");
  const [thickness, setThickness] = useState<number>(5)
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiObject>();
  const sendNotification = api.notifications.sendnotification.useMutation()
  const user = useSession().data?.user
  const { session, speaker, anonymous } = useSessionSpeaker().data
  const sessionTitle = api.sessions.getSessionById.useQuery({ id: session }).data?.title
  const speakerId = api.users.getUserByName.useQuery({ id: speaker }).data?.id

  if (!user || !session || !speaker || user.id == undefined || !res || res === null) {
    return <LoadingBar />
  }

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex)
  }

  const handleEmoji = () => {
    setEmojiDropdownState(!emojiDropdownState)
    setSelectedButton(EditorFunctions.Sticker)
  }

  function onClickEmoji(emoji: EmojiObject) {
    console.log(emoji);
    setSelectedEmoji(emoji);
    setEmojiDropdownState(false)
  }

  const submit = async () => {
    if (!stage) {
      return
    }
    if (user && user.id && user.name && sessionTitle && speakerId)
      try {
        const image = await createImage.mutateAsync({ dataUrl: stage.toDataURL() })
        const kudo = await createKudo.mutateAsync({ image: image.id, sessionId: session, userId: user.id, anonymous: anonymous });
        await sendNotification.mutateAsync({ message: (user.name).toString() + " sent you a kudo for your session about " + (sessionTitle).toString(), userId: speakerId, kudoId: kudo.id, photo: user.id })
        await router.replace('/out')
      } catch (e) {
        console.log(e);
      }
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <h1>Editor</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        {user?.role === UserRole.ADMIN &&
          <button
            className="btn btn-ghost btn-circle "
            onClick={() => void setSelectedButton(EditorFunctions.Save)}
            data-cy='SaveButton'
          >
            <FiSave size={20} />
          </button>
        }
      </UtilButtonsContent>
      {/* <div className="w-full h-fit bg-secondary text-white p-5 text-center">
        <h1 data-cy="session" className="lg:inline">&emsp;&emsp;&emsp;&emsp;Session: {sessionId}&emsp;&emsp;</h1><h1 data-cy="speaker" className="lg:inline"> Speaker: {speaker}</h1>
      </div> */}

      {selectedButton === EditorFunctions.Submit &&
        <ConfirmationModal
          prompt={"Is your Kudo ready to be sent?"}
          onCancel={() => setSelectedButton(EditorFunctions.None)}
          cancelLabel={"No"}
          onSubmit={() => void submit()}
          submitLabel={"Yes"}
        />
      }
      {/* Main */}
      <main className="flex flex-col items-center justify-center h-full z-50 relative overflow-x-hidden" >
        <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
          <div className="dropdown dropdown-start ">
            <label tabIndex={0} className=""><button onClick={() => setSelectedButton(EditorFunctions.Text)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Text ? "btn-accent" : "")}><BiText size={20} /> </button></label>
            <ul tabIndex={0} className=" dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <label className="label text-xs">Font</label>
              <select className="select select-bordered w-full max-w-xs" value={font} onChange={(e) => setFont(e.target.value)}>
                {Fonts.sort((a, b) => b < a ? 1 : -1).map(f =>
                  <option style={{ fontFamily: f }} key={f}>{f}</option>
                )}
              </select>
            </ul>
          </div>
          <div className="dropdown dropdown-start">
            <label tabIndex={0} className=""><button onClick={() => setSelectedButton(selectedButton == EditorFunctions.Erase ? EditorFunctions.Erase : EditorFunctions.Draw)} className={"btn btn-circle btn-secondary " + ((selectedButton == EditorFunctions.Draw || selectedButton == EditorFunctions.Erase) ? "btn-accent" : "")}>{selectedButton === EditorFunctions.Erase ? <BiEraser size={20} /> : <BiPencil size={20} />}</button></label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <div className='flex w-full items-center'>
                <div>
                  <li>
                    <BiPencil size={50} onClick={() => setSelectedButton(EditorFunctions.Draw)} />
                  </li>
                  <li >
                    <BiEraser size={50} onClick={() => setSelectedButton(EditorFunctions.Erase)} />
                  </li>
                </div>
                <li className='flex-auto w-full h-full items-center pointer-events-none'>
                  {selectedButton == EditorFunctions.Erase ?
                    <BiCircle size={40 + thickness} /> :
                    <BsFillCircleFill size={33 + thickness} color={color} />}
                </li>
              </div>
              <li>
                <div className='text-xs'>Thickness
                  <input type="range" min="1" height={thickness} max="50" value={thickness} className="range" onChange={(e) => setThickness(parseInt(e.target.value))} />
                </div>
              </li>
            </ul>
          </div>
          <div className="dropdown dropdown-start">
            <label tabIndex={0} className=""><button onClick={handleEmoji} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Sticker ? "btn-accent" : "")}>
              {selectedEmoji ? <>{selectedEmoji.native}</> : <GrEmoji size={20} />}
            </button></label>
            {emojiDropdownState && <ul tabIndex={0} className="dropdown-content ">
              <Picker data={data} onEmojiSelect={onClickEmoji} />
            </ul>}
          </div>
          <div className="dropdown dropdown-start ">
            <label tabIndex={0} className=""> <button className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Color ? "btn-accent" : "")}><BiPalette size={20} /></button></label>
            <ul tabIndex={0} className=" dropdown-content p-2 bg-secondary rounded-full w-80 ml-5 lg:w-fit -translate-x-2/3 lg:translate-x-0">
              <li className='align-middle flex gap-4'>
                <BsFillCircleFill size={16} onClick={() => setColor("#121212")} color={"#121212"} />
                <HuePicker color={color}
                  onChange={handleColorChange}
                />
              </li>
            </ul>
          </div>
          <button onClick={() => setSelectedButton(EditorFunctions.Undo)} className={"btn btn-circle btn-secondary" + (selectedButton == EditorFunctions.Undo ? "btn-accent" : "")}>
            <BiUndo size={20} />
          </button>
          <button onClick={() => setSelectedButton(EditorFunctions.Clear)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Clear ? "btn-accent" : "")}>
            <BiTrash size={20} />
          </button>
        </div>
        <div data-cy={res.id}></div>
        <KonvaCanvas editorFunction={selectedButton} template={res} thickness={thickness} color={color} fontFamily={font} setFunction={setSelectedButton} setStage={setStage} emoji={selectedEmoji} />
      </main>
      <FAB text={"Send"} icon={<FiSend />} onClick={() => setSelectedButton(EditorFunctions.Submit)} />
    </>
  );
};

export default Editor;