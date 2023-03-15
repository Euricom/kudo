import React, { useEffect, useRef, type MutableRefObject } from 'react';
import { type Template } from "@prisma/client";
import Konva from 'konva';
import addText from './addText';
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import {createHeader} from './setUpCanvas'

enum SelectedButton {
  Text = 'text',
  Draw = 'draw',
  Sticker = 'sticker',
  None = 'none'
}

type EditorCanvasProps = {
  button: SelectedButton | undefined,
  template: Template
  setSelectedButton: (type: SelectedButton) => void
}

const EditorCanvas = ({button, template, setSelectedButton}: EditorCanvasProps) => {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;

  const onClear = () => {
    layerRef.current?.removeChildren()
    createHeader(template.Color, template.Title, stageRef.current, layerRef.current)
  }

  const submit = async () => {
    layerRef.current.getChildren().forEach((e) => {
      console.log(e.getClassName());
      if (e.getClassName() == 'Transformer') {
        e.hide() 
      }
    })
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
  

const createStage = () => {
  // create the Konva stage, layer, and rectangle
  const sceneWidth = containerRef.current?.offsetWidth ?? 0;
  const sceneHeight = containerRef.current?.offsetHeight ?? 0;

  const newStage = new Konva.Stage({
      container: containerRef.current ?? 'kudo',
      width: sceneWidth,
      height: sceneHeight
  });
  const newLayer = new Konva.Layer();

  // add the rectangle to the layer, and the layer to the stage
  newStage.add(newLayer);

  // update the component refs
  stageRef.current = newStage;
  layerRef.current = newLayer;
  
  fitStageIntoParentContainer();
  // redraw the stage when the window is resized
  window.addEventListener('resize', fitStageIntoParentContainer);

  function fitStageIntoParentContainer() {
    // now we need to fit stage into parent container
    const containerWidth = containerRef.current?.offsetWidth;

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    const scale = (containerWidth ?? 0) / sceneWidth;

    newStage.width(sceneWidth * scale);
    newStage.height(sceneHeight * scale);
    newStage.scale({ x: scale, y: scale });
  }

  return () => {
      window.removeEventListener('resize', fitStageIntoParentContainer);
  };
};

  useEffect(() => {
    createStage()
    createHeader(template.Color, template.Title, stageRef.current, layerRef.current)
  }, [template]);

  useEffect(() => {
    stageRef.current.on('click tap', function () {
      switch (button) {
        case SelectedButton.Text:
          addText(stageRef.current, layerRef.current)
          setSelectedButton(SelectedButton.None)
        case SelectedButton.Draw:

        case SelectedButton.Sticker:
          setSelectedButton(SelectedButton.None)

      }
    });
  }, [button, setSelectedButton]);

  

  return (
    <>
    {/* Modal */}
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
    
    <div id='kudo' ref={containerRef} className="aspect-[3/2] w-full max-h-full max-w-5xl bg-white"></div>
    <FAB text={"Send"} icon={<FiSend />} url="/out" onClick={() => void submit()}/>
    </>
  );
};

EditorCanvas.displayName = "EditorCanvas"

export default EditorCanvas;