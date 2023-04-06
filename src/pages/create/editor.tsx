import React, { useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash, BiEraser, BiCircle, BiUndo } from "react-icons/bi"
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import { findTemplateById } from "~/server/services/templateService";
import FAB from "~/components/navigation/FAB";
import { FiSend } from "react-icons/fi"
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
import { EditorFunctions } from '~/types';


export async function getServerSideProps(context: { query: { template: string; }; }) {
  const id = context.query.template
  const data: Template = await findTemplateById(id)
  return {
    props: {
      res: data,
    }
  }
}



const KonvaCanvas = dynamic(
  () => import('../../components/editor/KonvaCanvas'),
  { ssr: false }
);

const Editor: NextPage<{ res: Template }> = ({ res }) => {
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>()
  const [thickness, setThickness] = useState<number>(5)
  const [stage, setStage] = useState<Konva.Stage>()
  const createKudo = api.kudos.createKudo.useMutation()
  const createImage = api.kudos.createKudoImage.useMutation()
  const router = useRouter()
  const [color, setColor] = useState<string>("#121212");

  const userId: string = useSession().data?.user.id ?? "error"

  const { session, speaker, anonymous } = useSessionSpeaker().data

  if (!userId || !session || !speaker || userId == undefined) {
    <LoadingBar />
  }

  const handleChange = (color: ColorResult) => {
    setColor(color.hex)
  }

  const submit = async () => {
    if (!stage) {
      console.log("Stage doesn't exist.");
      return
    }
    try {
      const image = await createImage.mutateAsync({ dataUrl: stage.toDataURL() })
      await createKudo.mutateAsync({ image: image.id, sessionId: session, userId: userId, anonymous: anonymous });

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
        <></>
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
      <main className="flex flex-col items-center justify-center h-full z-50" >
        <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
          <button onClick={() => setSelectedButton(EditorFunctions.Text)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Text ? "btn-accent" : "")}>
            <BiText size={20} />
          </button>
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
          <button onClick={() => setSelectedButton(EditorFunctions.Sticker)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Sticker ? "btn-accent" : "")}>
            <GrEmoji size={20} />
          </button>
          <div className="dropdown dropdown-start ">
            <label tabIndex={0} className=""> <button className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Color ? "btn-accent" : "")}><BiPalette size={20} /></button></label>
            <ul tabIndex={0} className=" dropdown-content p-2 bg-secondary rounded-full w-80 ml-5 lg:w-fit -translate-x-2/3 lg:translate-x-0">
              <li className='align-middle flex gap-4'>
                <BsFillCircleFill size={16} onClick={() => setColor("#121212")} color={"#121212"} />
                <HuePicker color={color}
                  onChange={handleChange}
                />
              </li>
            </ul>
          </div>
          <button onClick={() => setSelectedButton(EditorFunctions.Undo)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Undo ? "btn-accent" : "")}>
            <BiUndo size={20} />
          </button>
          <button onClick={() => setSelectedButton(EditorFunctions.Clear)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Clear ? "btn-accent" : "")}>
            <BiTrash size={20} />
          </button>
        </div>
        <KonvaCanvas editorFunction={selectedButton} template={res} thickness={thickness} color={color} setFunction={setSelectedButton} setStage={setStage} />
      </main>
      <FAB text={"Send"} icon={<FiSend />} onClick={() => setSelectedButton(EditorFunctions.Submit)} />
    </>
  );
};

export default Editor;