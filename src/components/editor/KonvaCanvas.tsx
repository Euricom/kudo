import React, { useRef, useState, useEffect, useMemo, type MutableRefObject } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva';
import type Konva from 'konva'
import { type Template } from '@prisma/client';
import { type KonvaEventObject } from 'konva/lib/Node';
import useDimensions from '~/hooks/useDimensions';
import { EditorFunctions } from '~/pages/create/editor';
import CanvasText from './canvasShapes/CanvasText';
import Rectangle from './canvasShapes/Rectangle';
import { type Vector2d } from 'konva/lib/types';
import { v4 } from 'uuid';
import ConfirmationModal from '~/components/input/ConfirmationModal';

export enum CanvasShapes {
  Text,
  Sticker,
  Rect
}

type KonvaCanvasProps = {
    editorFunction: EditorFunctions | undefined,
    template: Template,
    setFunction: (type: EditorFunctions) => void,
    setStage: (stage: Konva.Stage) => void
}

type Shapes = {
  type: CanvasShapes,
  id: string,
  x: number,
  y: number,
  width?: number,
  height?: number,
  fill?: string,
  text?: string,
}

const initialShapes: Shapes[] = [];

const KonvaCanvas = ({editorFunction, template, setFunction, setStage}: KonvaCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const staticLayerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const [shapes, setShapes] = useState(initialShapes);
  const [selectedId, selectShape] = useState<string | null>(null);

  const dimensions = useDimensions(containerRef);
  const stageDimensions = useMemo(
    () => ({
      width: dimensions?.width,
      height: dimensions?.height,
      scale: dimensions?.scale
    }),
    [dimensions]
  );

  useEffect(() => {
    if (editorFunction === EditorFunctions.Submit) {
      selectShape(null);
    }
  }, [editorFunction]);

  const checkDeselect = (e: KonvaEventObject<Event>) => {
    // deselect when clicked on empty area
    
    // selectShape(null);
    const clickedOnEmpty = e.target?.getLayer() === staticLayerRef.current
    
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const onClear = () => {
    layerRef.current?.removeChildren()
    setFunction(EditorFunctions.None)
  }

  const clickListener = () => {
    switch (editorFunction) {
      case EditorFunctions.Text:
        console.log('Text');
        addText(stageRef.current.getPointerPosition() ?? { x: 50, y: 50 })
        break
      case EditorFunctions.Draw:
        console.log('Draw');
        draw()
        break
      case EditorFunctions.Sticker:
        console.log('Sticker');
        addSticker()
        break
      default:
        console.log('None');
    }
  }

  const addText = (pos: Vector2d) => {
    const text = {
      id: v4(),
      type: CanvasShapes.Text,
      text: 'Text',
      x: pos.x / (stageDimensions.scale?.x??1),
      y: pos.y / (stageDimensions.scale?.y??1),
    }
    shapes.push(text)
    selectShape(text.id)
    setFunction(EditorFunctions.None)
  }

  const addSticker = () => {
    setFunction(EditorFunctions.None)
  }

  const draw = () => {
    setFunction(EditorFunctions.None)
  }

  useEffect(() => {
    setStage(stageRef.current)
  }, [setStage])

  return (
  <>
  {editorFunction === EditorFunctions.Clear &&
    <ConfirmationModal
      prompt={"Are you sure you want to clear the canvas?"}
      onCancel={() => setFunction(EditorFunctions.None)}
      cancelLabel={"No"}
      onSubmit={onClear}
      submitLabel={"Yes"}
    />
  }
  
  <div ref={containerRef} id='kudo' className="aspect-[3/2] w-full max-h-full max-w-5xl bg-neutral">
    <Stage ref={stageRef} 
      width={(stageDimensions?.width??1) * (stageDimensions.scale?.x??1)} 
      height={(stageDimensions?.height??1) * (stageDimensions.scale?.y??1)}
      scale={stageDimensions.scale}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      onClick={clickListener}
      onTap={clickListener}
    >
      <Layer ref={staticLayerRef}>
        <Rect
            width={stageDimensions?.width}
            height={stageDimensions?.height}
            fill={'white'}
        />
        <Header width={stageDimensions?.width} height={stageDimensions?.height} template={template}/>
      </Layer>
      <Layer ref={layerRef}>
        {shapes.map((s, i) => {
          switch (s.type) {
            case CanvasShapes.Text:
              return (
                <CanvasText
                  key={i}
                  shapeProps={s}
                  scale={stageDimensions.scale?.x??1}
                  fontSize={(stageDimensions?.height??0)/15}
                  isSelected={s.id === selectedId}
                  onSelect={() => {
                    selectShape(s.id);
                  }}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    setShapes(newShapes);
                  }}
                  areaPosition={{
                    x: (stageRef.current?.container().offsetLeft??0) + s.x * (stageDimensions?.scale?.x??1),
                    y: (stageRef.current?.container().offsetTop??0) + s.y * (stageDimensions?.scale?.y??1),
                  }}
                />
              );
            case CanvasShapes.Rect:
              return (
                <Rectangle
                  key={i}
                  shapeProps={s}
                  scale={stageDimensions.scale?.x??1}
                  isSelected={s.id === selectedId}
                  onSelect={() => {
                    selectShape(s.id);
                  }}
                  onChange={(newAttrs) => {
                    const newShapes = shapes.slice();
                    newShapes[i] = newAttrs;
                    setShapes(newShapes);
                  }}
                />
              );
            }
          })}
        </Layer>
    </Stage>
  </div>
  </>
  )
}

const Header = ({ width, height, template }: { width: number | undefined, height: number | undefined, template: Template }) => {
  return (
    <>
      <Rect
        width={width}
        height={(height ?? 0) / 4}
        fill={template.Color}
      />
      <Text
        width={width}
        height={(height ?? 0) / 4}
        text={template.Title}
        fontSize={(height ?? 0) / 6}
        fontFamily='Calibri'
        fill='white'
        align='center'
        verticalAlign='middle'
      />
    </>
  )
}

export default KonvaCanvas