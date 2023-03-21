import React, {useState, useRef, useEffect} from 'react';
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
import EditorCanvas, { EditorFunctions } from '~/editor/EditorCanvas';
import dynamic from 'next/dynamic';

export async function getServerSideProps(context: { query: { template: string; }; }) {
  const id = context.query.template
  const data: Template = await findTemplateById(id)
  return {
    props: {
      res: data,
    }
  }
}

const CanvasTest = dynamic(
  () => import('../../editor/CanvasTest'),
  { ssr: false }
);

const Editor: NextPage<{ res: Template }> = ({ res }) => {
  const [selectedButton, setSelectedButton] = useState<EditorFunctions>()

  const receiveDataUrl = async (dataUrl: string) => {
    try {
      await fetch('/api/kudo', 
      {
        body: JSON.stringify({ dataUrl: dataUrl }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      })
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
      <UtilButtonsContent>
          <button onClick={() => setSelectedButton(EditorFunctions.Text)} className={"btn btn-circle btn-secondary " + (selectedButton==EditorFunctions.Text? "btn-accent":"")}>
            <BiText size={20} />
          </button>
          <button onClick={() => setSelectedButton(EditorFunctions.Draw)} className={"btn btn-circle btn-secondary "+ (selectedButton==EditorFunctions.Draw? "btn-accent":"")}>
            <BiPencil size={20} />
          </button>
          <button onClick={() => setSelectedButton(EditorFunctions.Sticker)} className={"btn btn-circle btn-secondary "+ (selectedButton==EditorFunctions.Sticker? "btn-accent":"")}>
            <GrEmoji size={20} />
          </button>
          <button onClick={() => setSelectedButton(EditorFunctions.Color)} className={"btn btn-circle btn-secondary "+ (selectedButton==EditorFunctions.Color? "btn-accent":"")}>
            <BiPalette size={20} />
          </button>
          <button onClick={() => setSelectedButton(EditorFunctions.Clear)} className={"btn btn-circle btn-secondary "+ (selectedButton==EditorFunctions.Clear? "btn-accent":"")}>
            <BiTrash size={20} />
          </button>
      </UtilButtonsContent>
      {/* Main */}
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full" >
        {/* <EditorCanvas editorFunction={selectedButton} template={res} setFunction={setSelectedButton} receiveDataUrl={(data) => void receiveDataUrl(data)}/> */}
          <CanvasTest editorFunction={selectedButton} template={res} setFunction={setSelectedButton} receiveDataUrl={(data) => void receiveDataUrl(data)}/>
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" onClick={() => setSelectedButton(EditorFunctions.DataUrl)}/>
    </>
  );
};

export default Editor;