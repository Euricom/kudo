import React, { useRef, useCallback, useEffect, type MutableRefObject } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva';
import type Konva from 'konva'
import { ConfirmationModal, EditorFunctions } from './EditorCanvas';
import { type Template } from '@prisma/client';
import { createHeader } from './setUpCanvas';
import addText from './addText';

type CanvasTestProps = {
    editorFunction: EditorFunctions | undefined,
    template: Template,
    setFunction: (type: EditorFunctions) => void,
    receiveDataUrl: (dataUrl: string) => void,
    container: HTMLDivElement | null
}

const CanvasTest = ({editorFunction, template, setFunction, receiveDataUrl, container}: CanvasTestProps) => {
    const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
    const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
    console.log(container);
    

    const onClear = () => {
        layerRef.current?.removeChildren()
        // createHeader(template.Color, template.Title, stageRef.current, layerRef.current)
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

    
//   useEffect(() => {
//     createHeader(template.Color, template.Title, stageRef.current, layerRef.current)
//   }, [template]);

  useEffect(() => {
    const onAddText = () => {
      addText(stageRef.current, layerRef.current)
      setFunction(EditorFunctions.None)
    }

    const onDraw = () => {
      setFunction(EditorFunctions.None)
    }

    switch (editorFunction) {
      case EditorFunctions.Text:
        console.log('Text');
        stageRef.current.on('click tap', onAddText);
        break
      case EditorFunctions.Draw:
        console.log('Draw');
        break
      case EditorFunctions.Sticker:
        console.log('Sticker');
        stageRef.current.on('click tap', onDraw);
        break
      case EditorFunctions.DataUrl:
        receiveDataUrl(getDataUrl())
      default:
        console.log('None');
    }

    return () => {
      switch (editorFunction) {
        case EditorFunctions.Text:
          stageRef.current.removeEventListener('click tap')
          break
        case EditorFunctions.Draw:
          break
        case EditorFunctions.Sticker:
          stageRef.current.removeEventListener('click tap')
          break
      }
    }
  }, [editorFunction, setFunction, receiveDataUrl, getDataUrl]);

    return (
    <>
    {editorFunction === EditorFunctions.Clear && <ConfirmationModal onSubmit={onClear} onCancel={() => void 0}/>}
    <Stage ref={stageRef} width={container?.offsetWidth} height={container?.offsetHeight}>
        <Layer ref={layerRef}>
            <Header stage={stageRef.current} template={template}/>
        </Layer>
    </Stage>
    </>
    )
}

const Header = ({stage, template}: {stage: Konva.Stage, template:Template}) => {
    return (
        <>
            <Rect
                width={stage?.width()}
                height={stage?.height()/4}
                fill={template.Color}
            />
            <Text 
                x={stage?.width()/2}
                y={stage?.height()/8}
                text={template.Title}
                fontSize={stage?.height()/6}
                fontFamily='Calibri'
                fill='white'
            />
        </>
    )
}

export default CanvasTest