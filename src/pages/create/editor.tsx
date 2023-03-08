import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { UtilButtonsContent } from "~/hooks/useUtilButtons";

import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"

const Editor: NextPage = () => {
  const { editor, onReady } = useFabricJSEditor()
  const onAddText = () => {
    editor?.addText('Test')
  }
  const onDeleteSelected = (e: React.KeyboardEvent<HTMLImageElement>) => {
    const key = e.key
    console.log(key);
    // if (key = ) {
    //   editor?.deleteSelected()
    // }
  }
  const onClear = () => {
    editor?.deleteAll()
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UtilButtonsContent>
          <button onClick={onAddText} className="btn btn-ghost btn-circle">
              <BiText size={20} />
          </button>
          <button  className="btn btn-ghost btn-circle">
              <BiPencil size={20} />
          </button>
          <button  className="btn btn-ghost btn-circle">
              <GrEmoji size={20} />
          </button>
          <button  className="btn btn-ghost btn-circle">
            <BiPalette size={20} />
          </button>
          <button onClick={onClear} className="btn btn-ghost btn-circle">
            <BiTrash size={20} />
          </button>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <div className="aspect-[3/2] bg-green-400 w-full max-w-5xl" onKeyDown={(e: React.KeyboardEvent<HTMLImageElement>) => onDeleteSelected(e)}>
          <div className="kudo-header-container flex h-1/4 bg-red-500 items-center justify-center">
            <h1 className="kudo-header">Bedankt</h1>
          </div>
          <div className="bg-white w-full h-3/4">
            <FabricJSCanvas className="sample-canvas w-full h-full" onReady={onReady} />
          </div>
        </div>
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" />
    </>
  );
};

export default Editor;