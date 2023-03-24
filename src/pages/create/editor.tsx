import React, { useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import { findTemplateById } from "~/server/services/templateService";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useSessionSpeaker } from '~/sessions/SelectedSessionAndSpeaker';
import type Konva from 'konva';
import ConfirmationModal from '~/input/ConfirmationModel';

export async function getServerSideProps(context: { query: { template: string; }; }) {
  const id = context.query.template
  const data: Template = await findTemplateById(id)
  return {
    props: {
      res: data,
    }
  }
}

export enum EditorFunctions {
  Text = 'text',
  Draw = 'draw',
  Sticker = 'sticker',
  Color = 'color',
  Clear = 'clear',
  Submit = 'submit',
  None = 'none'
}

const KonvaCanvas = dynamic(
  () => import('../../editor/KonvaCanvas'),
  { ssr: false }
);

const Editor: NextPage<{ res: Template }> = ({ res }) => {
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>()
  const [stage, setStage] = useState<Konva.Stage>()
  const createKudo = api.kudos.createKudo.useMutation()
  const createImage = api.kudos.createKudoImage.useMutation()
  const router = useRouter()

  const userId: string = useSession().data?.user.id ?? "error"

  const { session, speaker, anonymous } = useSessionSpeaker().data

  if (!userId || !session || !speaker || userId == undefined) {
    console.log("een probleem");

  }

  const submit = async () => {
    if(!stage){
      console.log("Stage doesn't exist.");
      return
    }
    try {
      const image = await createImage.mutateAsync({ dataUrl: stage.toDataURL() })
      await createKudo.mutateAsync({ image: image.id, sessionId: session, userId: userId, anonymous: anonymous});

      await router.replace('/out')
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <NavigationBarContent>
        <h1>Editor</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="w-full h-fit bg-secondary text-white p-5 text-center">
        <h1 data-cy="session" className="lg:inline">&emsp;&emsp;&emsp;&emsp;Session: {sessionId}&emsp;&emsp;</h1><h1 data-cy="speaker" className="lg:inline"> Speaker: {speaker}</h1>
      </div> */}
      <UtilButtonsContent>
        <button onClick={() => setSelectedButton(EditorFunctions.Text)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Text ? "btn-accent" : "")}>
          <BiText size={20} />
        </button>
        <button onClick={() => setSelectedButton(EditorFunctions.Draw)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Draw ? "btn-accent" : "")}>
          <BiPencil size={20} />
        </button>
        <button onClick={() => setSelectedButton(EditorFunctions.Sticker)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Sticker ? "btn-accent" : "")}>
          <GrEmoji size={20} />
        </button>
        <button onClick={() => setSelectedButton(EditorFunctions.Color)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Color ? "btn-accent" : "")}>
          <BiPalette size={20} />
        </button>
        <button onClick={() => setSelectedButton(EditorFunctions.Clear)} className={"btn btn-circle btn-secondary " + (selectedButton == EditorFunctions.Clear ? "btn-accent" : "")}>
          <BiTrash size={20} />
        </button>
      </UtilButtonsContent>
      
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
        <KonvaCanvas editorFunction={selectedButton} template={res} setFunction={setSelectedButton} setStage={setStage}/>
      </main>
      <FAB text={"Send"} icon={<FiSend />} onClick={() => setSelectedButton(EditorFunctions.Submit)}/>
    </>
  );
};

export default Editor;