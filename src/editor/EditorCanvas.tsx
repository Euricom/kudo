import React, { useEffect, useRef, type MutableRefObject } from 'react';
import { type Template } from "@prisma/client";
import type Konva from 'konva';
import addText from './addText';
import {createHeader, createStage} from './setUpCanvas'

export enum EditorFunctions {
  Text = 'text',
  Draw = 'draw',
  Sticker = 'sticker',
  Color = 'color',
  Clear = 'clear',
  DataUrl = 'dataurl',
  None = 'none'
}

type EditorCanvasProps = {
  editorFunction: EditorFunctions | undefined,
  template: Template,
  setFunction: (type: EditorFunctions) => void,
  receiveDataUrl: (dataUrl: string) => void
}

const EditorCanvas = ({editorFunction, template, setFunction, receiveDataUrl}: EditorCanvasProps) => {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;

  const onClear = () => {
    layerRef.current?.removeChildren()
    createHeader(template.Color, template.Title, stageRef.current, layerRef.current)
    setFunction(EditorFunctions.None)
  }

  const getDataUrl = () => {
    layerRef.current.getChildren().forEach((e) => {
      if (e.getClassName() == 'Transformer') {
        e.hide() 
      }
    })
    return stageRef.current.toDataURL();
  }

  useEffect(() => {
    const {stage, layer, cleanUp} = createStage(containerRef.current ?? new HTMLDivElement())
    stageRef.current = stage
    layerRef.current = layer
    createHeader(template.Color, template.Title, stageRef.current, layerRef.current)
    return () => {
      cleanUp()
    }
  }, [template]);

  useEffect(() => {
    switch (editorFunction) {
      case EditorFunctions.Text:
        console.log('Text');
        stageRef.current.on('click tap', function () {
          addText(stageRef.current, layerRef.current)
          setFunction(EditorFunctions.None)
        });
        break
      case EditorFunctions.Draw:
        console.log('Draw');
        break
      case EditorFunctions.Sticker:
        console.log('Sticker');
        stageRef.current.on('click tap', function () {
          setFunction(EditorFunctions.None)
        });
        break
      case EditorFunctions.DataUrl:
        receiveDataUrl(getDataUrl())
      default:
        console.log('None');
    }

    return () => {
      switch (editorFunction) {
        case EditorFunctions.Text:
          stageRef.current.removeEventListener('click tap', )
          break
        case EditorFunctions.Draw:
          break
        case EditorFunctions.Sticker:
          stageRef.current.removeEventListener('click tap', )
          break
      }
    }
  }, [editorFunction, setFunction, receiveDataUrl]);

  

  return (
    <>
    {editorFunction === EditorFunctions.Clear && <ConfirmationModal onSubmit={onClear} onCancel={() => void 0}/>}
    <div id='kudo' ref={containerRef} className="aspect-[3/2] w-full max-h-full max-w-5xl bg-white"></div>
    </>
  );
};

type ModalProps = {
  onSubmit: () => void, 
  onCancel: () => void
}

//Later in aparte component folder
const ConfirmationModal = ({onSubmit, onCancel}: ModalProps) => {
  return (
    <>
      {/* Modal */}
      <input type="checkbox" className="modal-toggle" checked={true}/>
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box form-control">
          <label className="label">
            <span className="label-text">Are you sure you want to clear the canvas?</span>
          </label>
          <div className="modal-action">
            <label htmlFor="my-modal-clear" className="btn" onClick={onCancel}>No</label>
            <label htmlFor="my-modal-clear" className="btn text-error" onClick={onSubmit}>Yes</label>
          </div>
        </div>
      </div>
    </>
  )
}

EditorCanvas.displayName = "EditorCanvas"

export default EditorCanvas;