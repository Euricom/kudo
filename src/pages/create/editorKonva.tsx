import React, { useEffect, useState, useCallback, useRef, type MutableRefObject } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { GrEmoji } from "react-icons/gr"
import { BiPencil, BiPalette, BiText, BiTrash } from "react-icons/bi"
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import { findTemplateById } from "~/server/services/templateService";
import Konva from 'konva';


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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;

  const onAddText = () => {
    setMessage('')
  }
  const onDeleteSelected = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Delete') {
      
    }
  }
  const onClear = () => {
    layerRef.current?.removeChildren()
    createHeader()
  }

  const submit = async () => {
    const dataUrl = stageRef.current.toDataURL();
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

  const createHeader = useCallback(() => {
    const headerRect = new Konva.Rect({
      width: stageRef.current?.width(),
      height: stageRef.current?.height()/4,
      fill: res.Color,
    });
    const headerText = new Konva.Text({
      x: stageRef.current?.width()/2,
      y: headerRect.height()/2,
      text: res.Title,
      fontSize: headerRect.height()/1.5,
      fontFamily: 'Calibri',
      fill: 'white',
    });
    headerText.offsetX(headerText.width() / 2);
    headerText.offsetY(headerText.height() / 3);
    layerRef.current?.add(headerRect, headerText)
  }, [res])

  const createStage = () => {
    // create the Konva stage, layer, and rectangle
    const stage = new Konva.Stage({
      container: containerRef.current ?? 'kudo',
      width: containerRef.current?.offsetWidth,
      height: containerRef.current?.offsetHeight
    });
    const layer = new Konva.Layer();

    // add the rectangle to the layer, and the layer to the stage
    stage.add(layer);

    // update the component refs
    stageRef.current = stage;
    layerRef.current = layer;

    // redraw the stage when the window is resized
    window.addEventListener('resize', handleResize);
    function handleResize() {
      stage.width(containerRef.current?.offsetWidth ?? 0);
      stage.height(containerRef.current?.offsetHeight ?? 0);
      stage.batchDraw();
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  useEffect(() => {
    createStage()
    createHeader()
  }, [createHeader]);

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
        <div id='kudo' ref={containerRef} className="aspect-[3/2] w-full max-h-full max-w-5xl bg-white" onKeyDown={onDeleteSelected} tabIndex={0}></div>
        {/* <button className='btn' onClick={() => void submit()}>Test submit zonder redirect</button> */}
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" onClick={() => void submit()}/>
    </>
  );
};

export default Editor;