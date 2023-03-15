import React from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import { findTemplateById } from "~/server/services/templateService";
import { useSessionSpeaker } from '~/sessions/SelectedSessionAndSpeaker';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
// import { trpc } from '~/utils/trpc';
import EditorCanvas from '~/editor/EditorCanvas';


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
        <label htmlFor="my-modal-text" className="btn btn-circle btn-secondary">
          <BiText size={20} />
        </label>
        <button className="btn btn-circle btn-secondary">
          <BiPencil size={20} />
        </button>
        <button className="btn btn-circle btn-secondary">
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
        <EditorCanvas {...res} />
      </main>
    </>
  );
};

export default Editor;