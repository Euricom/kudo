import React, { useEffect, useState, useRef, type MutableRefObject } from 'react';
import { type Template } from "@prisma/client";
import Konva from 'konva';
import addText from './addText';
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import { createHeader } from './setUpCanvas'
import { useSession } from 'next-auth/react';
import { useSessionSpeaker } from '~/sessions/SelectedSessionAndSpeaker';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import { v4 } from "uuid";


const EditorCanvas = (props: Template) => {
  const [message, setMessage] = useState('');

  const createKudo = trpc.kudos.createKudo.useMutation()
  const createImage = trpc.kudos.createKudoImage.useMutation()
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const userId: string = useSession().data?.user.id ?? "error"

  const sessionId: string | undefined = useSessionSpeaker(undefined, undefined).data.session
  const speaker: string | undefined = useSessionSpeaker(undefined, undefined).data.speaker
  const router = useRouter()


  const onAddText = () => {
    addText(message, stageRef.current, layerRef.current)
    setMessage('')
  }

  const onDeleteSelected = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Delete') {

    }
  }
  const onClear = () => {
    layerRef.current?.removeChildren()
    createHeader(props.Color, props.Title, stageRef.current, layerRef.current)
  }

  const submit = async () => {
    const id: string = v4()
    console.log(id);

    const dataUrl = stageRef.current.toDataURL();
    try {
      createImage.mutate({ id: id, dataUrl: dataUrl })
      createKudo.mutate({ image: id, sessionId: sessionId, userId: userId });


      await router.replace('/out')
    } catch (e) {
      console.log(e);
    }


  }


  const createStage = () => {
    // create the Konva stage, layer, and rectangle
    const newStage = new Konva.Stage({
      container: containerRef.current ?? 'kudo',
      width: containerRef.current?.offsetWidth,
      height: containerRef.current?.offsetHeight
    });
    const newLayer = new Konva.Layer();

    // add the rectangle to the layer, and the layer to the stage
    newStage.add(newLayer);

    // update the component refs
    stageRef.current = newStage;
    layerRef.current = newLayer;

    // redraw the stage when the window is resized
    window.addEventListener('resize', handleResize);
    function handleResize() {
      newStage.width(containerRef.current?.offsetWidth ?? 0);
      newStage.height(containerRef.current?.offsetHeight ?? 0);
      newStage.batchDraw();
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  useEffect(() => {
    createStage()
    createHeader(props.Color, props.Title, stageRef.current, layerRef.current)
  }, [props]);

  if (!userId || !sessionId || !speaker || userId == undefined) {
    console.log("een probleem");

  }
  return (
    <>
      {/* Modal */}
      <input type="checkbox" id="my-modal-text" className="modal-toggle" />
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
            <label htmlFor="my-modal-text" className="btn" onClick={onAddText}>Ok</label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="my-modal-clear" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box form-control">
          <label className="label">
            <span className="label-text">Are you sure you want to clear the canvas?</span>
          </label>
          <div className="modal-action">
            <label htmlFor="my-modal-clear" className="btn">No</label>
            <label htmlFor="my-modal-clear" className="btn text-error" onClick={onClear}>Yes</label>
          </div>
        </div>
      </div>
      <div id='kudo' ref={containerRef} className="aspect-[3/2] w-full max-h-full max-w-5xl bg-white" onKeyDown={onDeleteSelected} tabIndex={0}></div>

      <FAB text={"Send"} icon={<FiSend />} url={undefined} onClick={() => void submit()} />
    </>
  );
};

EditorCanvas.displayName = "EditorCanvas"

export default EditorCanvas;