import React, {useState} from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import { findTemplateById } from "~/server/services/templateService";
import EditorCanvas from '~/editor/EditorCanvas';

enum SelectedButton {
  Text = 'text',
  Draw = 'draw',
  Sticker = 'sticker',
}

export async function getServerSideProps(context: { query: { template: string; }; }) {
  const id = context.query.template
  const data: Template = await findTemplateById(id)
  return {
    props: {
      res: data,
    }
  }
}

const Editor: NextPage<{ res: Template }> = ({ res }) => {
  const [selectedButton, setSelectedButton] = useState<SelectedButton>()

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
          <button onClick={() => setSelectedButton(SelectedButton.Text)} className="btn btn-circle btn-secondary">
            <BiText size={20} />
          </button>
          <button onClick={() => setSelectedButton(SelectedButton.Draw)} className="btn btn-circle btn-secondary">
            <BiPencil size={20} />
          </button>
          <button onClick={() => setSelectedButton(SelectedButton.Sticker)} className="btn btn-circle btn-secondary">
            <GrEmoji size={20} />
          </button>
          <button className="btn btn-circle btn-secondary">
            <BiPalette size={20} />
          </button>
          <label htmlFor="my-modal-clear" className="btn btn-circle btn-secondary">
            <BiTrash size={20} />
          </label>
      </UtilButtonsContent>
      {/* Main */}
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full" >
        <EditorCanvas button={selectedButton} template={res} />
      </main>
    </>
  );
};

export default Editor;