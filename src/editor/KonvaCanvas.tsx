import React, { useRef, useCallback, useEffect, useState, useMemo, type MutableRefObject } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva';
import type Konva from 'konva'
import { type Template } from '@prisma/client';
import addText from './addText';
import { type KonvaEventObject } from 'konva/lib/Node';
import useDimensions from '~/hooks/useDimensions';
import { EditorFunctions } from '~/pages/create/editor';

type KonvaCanvasProps = {
    editorFunction: EditorFunctions | undefined,
    template: Template,
    setFunction: (type: EditorFunctions) => void,
    receiveDataUrl: (dataUrl: string) => void
}

const KonvaCanvas = ({editorFunction, template, setFunction, receiveDataUrl}: KonvaCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
    const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
    const [selectedId, selectShape] = useState(null);

    const dimensions = useDimensions(containerRef);
    const stageDimensions = useMemo(
      () => ({
        width: dimensions?.width,
        height: dimensions?.height,
        scale: dimensions?.scale
      }),
      [dimensions]
    );

    const canvasNodes: React.ReactFragment[] = []

    
  const checkDeselect = (e: KonvaEventObject<Event>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target?.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

    const onClear = () => {
        layerRef.current?.removeChildren()
        setFunction(EditorFunctions.None)
    }

    const getDataUrl = useCallback(() => {
        layerRef.current.getChildren().forEach((e) => {
            if (e.getClassName() == 'Transformer') {
            e.hide() 
            }
        })
        return stageRef.current.toDataURL();
    }, [])

  useEffect(() => {
    const stage = stageRef.current
    const onAddText = () => {
      addText(stage, layerRef.current)
      setFunction(EditorFunctions.None)
    }

    const onDraw = () => {
      setFunction(EditorFunctions.None)
    }

    switch (editorFunction) {
      case EditorFunctions.Text:
        console.log('Text');
        stage.on('click tap', onAddText);
        break
      case EditorFunctions.Draw:
        console.log('Draw');
        break
      case EditorFunctions.Sticker:
        console.log('Sticker');
        stage.on('click tap', onDraw);
        break
      case EditorFunctions.DataUrl:
        receiveDataUrl(getDataUrl())
      default:
        console.log('None');
    }

    return () => {
      switch (editorFunction) {
        case EditorFunctions.Text:
          stage.removeEventListener('click tap')
          break
        case EditorFunctions.Draw:
          break
        case EditorFunctions.Sticker:
          stage.removeEventListener('click tap')
          break
      }
    }
  }, [editorFunction, setFunction, receiveDataUrl, getDataUrl]);

    return (
    <>
    {editorFunction === EditorFunctions.Clear && <ConfirmationModal onSubmit={onClear} onCancel={() => setFunction(EditorFunctions.None)}/>}
    
    <div ref={containerRef} id='kudo' className="aspect-[3/2] w-full max-h-full max-w-5xl bg-green-200">
      <Stage ref={stageRef} 
        width={stageDimensions?.width} 
        height={stageDimensions?.height}
        // scale={stageDimensions.scale}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
          <Layer>
            <Rect
                width={stageDimensions?.width}
                height={stageDimensions?.height}
                fill={'white'}
            />
            <Header width={stageDimensions?.width} height={stageDimensions?.height} template={template}/>
          </Layer>
          <Layer ref={layerRef}>

          </Layer>
      </Stage>
    </div>
    </>
    )
}

const Header = ({width, height, template}: {width: number | undefined, height: number|undefined, template:Template}) => {
    return (
        <>
            <Rect
                width={width}
                height={(height??0)/4}
                fill={template.Color}
            />
            <Text 
                width={width}
                height={(height??0)/4}
                text={template.Title}
                fontSize={(height??0)/6}
                fontFamily='Calibri'
                fill='white'
                align='center'
                verticalAlign='middle'
            />
        </>
    )
}

type ModalProps = {
  onSubmit: () => void, 
  onCancel: () => void
}

//Later in aparte component folder
const ConfirmationModal = ({onSubmit, onCancel}: ModalProps) => {
  return (
    <>
      {/* Modal */}
      <input type="checkbox" className="modal-toggle" checked readOnly/>
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box form-control">
          <label className="label">
            <span className="label-text">Are you sure you want to clear the canvas?</span>
          </label>
          <div className="modal-action">
            <button className="btn" onClick={onCancel}>No</button>
            <button className="btn text-error" onClick={onSubmit}>Yes</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default KonvaCanvas