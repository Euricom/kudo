import React, { useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { UtilButtonsContent } from "~/hooks/useUtilButtons";

import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"

const Editor: NextPage = () => {
  const [message, setMessage] = useState('');
  const { editor, onReady } = useFabricJSEditor()
  const onAddText = () => {
    editor?.addText(message)
    setMessage('')
  }
  const onDeleteSelected = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Delete') {
      editor?.deleteSelected()
    }
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
          <label htmlFor="my-modal-6" className="btn btn-circle btn-secondary">
            <BiText size={20} />
          </label>
          <button  className="btn btn-circle btn-secondary">
            <BiPencil size={20} />
          </button>
          <button  className="btn btn-circle btn-secondary">
            <GrEmoji size={20} />
          </button>
          <button  className="btn btn-circle btn-secondary">
            <BiPalette size={20} />
          </button>
          <button onClick={onClear} className="btn btn-circle btn-secondary">
            <BiTrash size={20} />
          </button>
      </UtilButtonsContent>
      {/* Modal */}
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box form-control">
          <label className="label">
            <span className="label-text">Message</span>
          </label>
          <textarea 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            value={message}
            className="textarea textarea-bordered h-24" />
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn" onClick={onAddText}>Ok</label>
          </div>
        </div>
      </div>
      {/* Main */}
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full" >
        <div className="aspect-[3/2] w-full max-h-full max-w-5xl">
          <div className="kudo-header-container flex h-1/4 bg-red-500 items-center justify-center">
            <h1 className="kudo-header">Bedankt</h1>
          </div>
          <div className="w-full h-3/4" onKeyDown={onDeleteSelected} tabIndex={0}>
            <FabricJSCanvas className="w-full h-full bg-white" onReady={onReady} />
          </div>
        </div>
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" />
    </>
  );
};

export default Editor;