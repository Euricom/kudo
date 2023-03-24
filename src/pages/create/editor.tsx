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
  DataUrl = 'dataurl',
  None = 'none'
}

const KonvaCanvas = dynamic(
  () => import('../../editor/KonvaCanvas'),
  { ssr: false }
);

const Editor: NextPage<{ res: Template }> = ({ res }) => {
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>()
  const createKudo = api.kudos.createKudo.useMutation()
  const createImage = api.kudos.createKudoImage.useMutation()
  const router = useRouter()

  const userId: string = useSession().data?.user.id ?? "error"
  const sessionId: string | undefined = useSessionSpeaker(undefined, undefined, undefined).data.session
  const speaker: string | undefined = useSessionSpeaker(undefined, undefined, undefined).data.speaker

  if (!userId || !sessionId || !speaker || userId == undefined) {
    console.log("een probleem");

  }

  const receiveDataUrl = async (dataUrl: string) => {
    try {
      // const image = await createImage.mutateAsync({ dataUrl: dataUrl })
      // await createKudo.mutateAsync({ image: image.id, sessionId: sessionId, userId: userId });

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
      {/* Main */}
      <main className="flex flex-col items-center justify-center h-full" >
        <KonvaCanvas editorFunction={selectedButton} template={res} setFunction={setSelectedButton} receiveDataUrl={(data) => void receiveDataUrl(data)} />
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" onClick={() => setSelectedButton(EditorFunctions.DataUrl)} />
    </>
  );
};

export default Editor;