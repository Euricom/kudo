import React, { useEffect, useState, useCallback } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { fabric } from 'fabric';
import { type Template } from "@prisma/client";
import { findTemplateById } from "~/server/services/templateService";
import { useSessionSpeaker } from '~/sessions/SelectedSessionAndSpeaker';
import { useRouter } from 'next/router';


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

  const [message, setMessage] = useState('');
  const { editor, onReady } = useFabricJSEditor()
  const [canvas, setCanvas] = useState<fabric.Canvas>();


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
    createHeader()
  }

  const createHeader = useCallback(() => {
    const title = res.Title
    const color = res.Color
    const rect: fabric.Rect = new fabric.Rect({
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasControls: false,
      hasBorders: false,
      height: (canvas?.height ?? 0) / 4,
      width: canvas?.width ?? 0,
      fill: color
    })
    const text: fabric.Text = new fabric.Text(
      title,
      {
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hasBorders: false,
        textAlign: 'center',
        fontSize: (rect.get('height') ?? 0) / 1.5
      })
    text.set({
      left: ((canvas?.width ?? 0) / 2) - (text.get('width') ?? 0) / 2,
      top: (rect.get('height') ?? 0) / 2 - (text.get('height') ?? 0) / 2,
      fill: '#fff'
    })
    canvas?.add(rect, text)
  }, [canvas, res])

  useEffect(() => {
    setCanvas(editor?.canvas);
    createHeader()
  }, [editor?.canvas, createHeader]);

  const sessionId: string | undefined = useSessionSpeaker(undefined, undefined).data.session
  const speaker: string | undefined = useSessionSpeaker(undefined, undefined).data.speaker
  const router = useRouter()
  if (!sessionId || !speaker) {
    router.back()
  }
  console.log(sessionId);

  const submit = async () => {
    const dataUrl = canvas?.getElement().toDataURL();


    try {
      await fetch('/api/kudo',
        {
          body: JSON.stringify({ dataUrl: dataUrl, sessionId: sessionId }),
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
      {/* <div className="w-full h-fit bg-secondary text-white p-5 text-center">
        <h1 data-cy="session" className="lg:inline">&emsp;&emsp;&emsp;&emsp;Session: {sessionId}&emsp;&emsp;</h1><h1 data-cy="speaker" className="lg:inline"> Speaker: {speaker}</h1>
      </div> */}
      <UtilButtonsContent>
        <label htmlFor="my-modal-6" className="btn btn-circle btn-secondary">
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
        <div id="kudo" className="aspect-[3/2] w-full max-h-full max-w-5xl" onKeyDown={onDeleteSelected} tabIndex={0}>
          <FabricJSCanvas className="w-full h-full bg-white" onReady={onReady} />
        </div>
        <button className='btn' onClick={() => void submit()}>Test submit zonder redirect</button>
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" onClick={() => void submit()} />
    </>
  );
};

export default Editor;