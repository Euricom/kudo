import React, { useRef, useState, useEffect, useMemo, type MutableRefObject, useCallback } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva';
import type Konva from 'konva'
import { type KonvaEventObject } from 'konva/lib/Node';
import useDimensions from '~/hooks/useDimensions';
import CanvasText from './canvasShapes/CanvasText';
import Rectangle from './canvasShapes/Rectangle';
import { type Vector2d } from 'konva/lib/types';
import { v4 } from 'uuid';
import { CanvasShapes, EditorFunctions, type KonvaCanvasProps, type Shapes } from '~/types';

const initialShapes: Shapes[] = [];

const KonvaCanvas = ({ editorFunction, template, thickness, color, fontFamily, emoji, setFunction, setStage }: KonvaCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const staticLayerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const [shapes, setShapes] = useState(initialShapes);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [history] = useState<Shapes[]>([])

  const [line, setLine] = useState<Shapes[]>([]);


  const isDrawing = useRef(false);

  const dimensions = useDimensions(containerRef);
  const stageDimensions = useMemo(
    () => ({
      width: dimensions?.width,
      height: dimensions?.height,
      scale: dimensions?.scale
    }),
    [dimensions]
  );

  const makeHeader = useCallback(() => {
    const header = {
      type: CanvasShapes.Text,
      id: "header",
      x: 0,
      y: 0,
      text: template.Title,
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      width: stageDimensions.width,
      height: (stageDimensions.height ?? 0) / 4,
      fontSize: (stageDimensions.height ?? 0) / 6,
      draggable: false,
    }
    if (shapes.find(s => s.id === "header")?.width !== header.width) {
      const newShapes = shapes.slice();
      newShapes[0] = header;
      history.shift()
      history.unshift(header)
      setShapes(newShapes);
    }
    if (shapes.find(s => s.id === "header")) {
      return
    }
    setShapes([])
    shapes.push(header)
    setShapes(shapes)

  }, [shapes, stageDimensions, template, history])


  useEffect(() => {
    makeHeader()
  }, [makeHeader, template])

  useEffect(() => {
    setShapes([])
  }, [template])

  const undo = useCallback(() => {
    const lastShape = history.shift()
    const shapeToBe = history.find(s => s.id === lastShape?.id)
    const shape = shapes.find(s => s.id === lastShape?.id)
    if (!shape) {
      if (lastShape) {
        shapes.push(lastShape)
        setShapes(shapes)
      }
      setFunction(EditorFunctions.None)
      return
    }
    const index = shapes.indexOf(shape)
    if (shapeToBe) {
      shapes[index] = shapeToBe
    } else {
      if (lastShape?.id === "header") {
        history.unshift(lastShape)
      } else {
        shapes.splice(index, 1)
      }
    }
    setShapes(shapes)

    setFunction(EditorFunctions.None)
  }, [setFunction, history, shapes])


  useEffect(() => {
    if (editorFunction === EditorFunctions.Submit) {
      selectShape(null);
    }
    if (editorFunction === EditorFunctions.Undo) {
      undo();
    }
  }, [editorFunction, undo]);

  const onDelete = (id: string) => {
    const shape = shapes.find(s => s.id === id)
    if (!shape) {
      return
    }
    const index = shapes.indexOf(shape)
    shapes.splice(index, 1)

    history.unshift(shape)
    selectShape(null)
    setFunction(EditorFunctions.None)
  }

  const clickListener = (e: KonvaEventObject<Event>) => {
    // deselect when clicked on empty area

    // selectShape(null);
    const clickedOnEmpty = e.target?.getLayer() === staticLayerRef.current

    if (clickedOnEmpty) {
      selectShape(null);
    }
    switch (editorFunction) {
      case EditorFunctions.Text:
        addText(stageRef.current.getPointerPosition() ?? { x: 50, y: 50 })
        break
      case EditorFunctions.Sticker:
        addSticker()
        break
    }
  }

  const addText = (pos: Vector2d) => {
    const text = makeText(pos)
    history.unshift(text)
    shapes.push(text)
    selectShape(text.id)
    setFunction(EditorFunctions.None)
  }

  const makeText = (pos: Vector2d) => {
    const text = {
      id: v4(),
      type: CanvasShapes.Text,
      text: 'Text',
      fill: color,
      fontFamily: fontFamily,
      x: pos.x / (stageDimensions.scale?.x ?? 1),
      y: pos.y / (stageDimensions.scale?.y ?? 1),
      fontSize: (stageDimensions?.height ?? 0) / 15,
      draggable: true
    }
    return text
  }



  const addSticker = () => {
    const pos = stageRef.current.getPointerPosition() ?? { x: 50, y: 50 }
    const sticker = {
      id: v4(),
      type: CanvasShapes.Image,
      image: emoji,
      x: pos.x / (stageDimensions.scale?.x ?? 1),
      y: pos.y / (stageDimensions.scale?.y ?? 1),
      draggable: true
    }
    history.unshift(sticker)
    shapes.push(sticker)
    selectShape(sticker.id)
    setFunction(EditorFunctions.None)
  }



  const handleMouseDown = () => {
    if (editorFunction === EditorFunctions.Draw || editorFunction === EditorFunctions.Erase) {
      selectShape(null)
      isDrawing.current = true;
      const pos = stageRef.current.getPointerPosition() ?? { x: 0, y: 0 };
      setLine([...line, { type: CanvasShapes.Line, id: v4(), tool: editorFunction === EditorFunctions.Erase ? "destination-out" : "source-over", points: [pos.x, pos.y], thickness: thickness, color: color }]);
    }
  };
  const handleMouseMove = () => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = stageRef.current;
    const point = stage.getPointerPosition() ?? { x: 0, y: 0 };
    if (line) {
      const lastLine = line[line.length - 1] ?? { type: CanvasShapes.Line, id: "1", tool: "source-over", points: [0, 0], thickness: thickness, color: color };
      // add point
      lastLine.points = lastLine.points?.concat([point.x, point.y]);

      // replace last
      line.splice(line.length - 1, 1, lastLine);
      setLine(line.concat());
    }
  };

  const handleMouseUp = () => {
    if (line.length > 0) {
      const newShape = line.pop()
      if (newShape) {
        history.unshift(newShape)
        shapes.push(newShape)
      }
      setLine([])

    }
    isDrawing.current = false;
  };

  useEffect(() => {
    setStage(stageRef.current)
  }, [setStage])

  return (
    <><div ref={containerRef} id='kudo' className="aspect-[3/2] w-full max-h-full max-w-xl lg:max-w-3xl bg-neutral">
      <Stage ref={stageRef}
        width={(stageDimensions?.width ?? 1) * (stageDimensions.scale?.x ?? 1)}
        height={(stageDimensions?.height ?? 1) * (stageDimensions.scale?.y ?? 1)}
        scale={stageDimensions.scale}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onClick={clickListener}
        onTap={clickListener}
      >
        <Layer ref={staticLayerRef}>
          <Rect
            width={stageDimensions?.width}
            height={stageDimensions?.height}
            fill={'white'}
          />
          <Rect
            width={stageDimensions?.width}
            height={(stageDimensions?.height ?? 0) / 4}
            fill={template.Color}
          />
        </Layer>

        <Layer ref={layerRef}>
          {shapes.map((s, i) => {
            switch (s.type) {
              case CanvasShapes.Line:
                return (
                  <Line
                    key={i}
                    points={s.points}
                    stroke={s.color}
                    strokeWidth={s.thickness}
                    tension={0.5}
                    lineJoin='round'
                    lineCap="round"
                    globalCompositeOperation={s.tool === "destination-out" ? "destination-out" : "source-over"}
                  />
                )
              case CanvasShapes.Text:
                return (
                  <CanvasText
                    container={containerRef.current ?? undefined}
                    key={i}
                    shapeProps={s}
                    scale={stageDimensions.scale?.x ?? 1}
                    isSelected={s.id === selectedId}
                    onSelect={() => {
                      selectShape(s.id);
                    }}
                    onChange={(newAttrs) => {
                      const newShapes = shapes.slice();
                      newShapes[i] = newAttrs;
                      setShapes(newShapes);

                    }}
                    onChangeEnd={(newAttrs) => {

                      history.unshift(newAttrs)

                    }}
                    areaPosition={{
                      x: (stageRef.current?.container().offsetLeft ?? 0) + (s.x ?? 1) * (stageDimensions?.scale?.x ?? 1),
                      y: (stageRef.current?.container().offsetTop ?? 0) + (s.y ?? 1) * (stageDimensions?.scale?.y ?? 1),
                    }}
                    onDelete={onDelete}
                    editorFunction={editorFunction ?? EditorFunctions.None}
                  />
                );
              case CanvasShapes.Rect:
                return (
                  <Rectangle
                    key={i}
                    shapeProps={s}
                    scale={stageDimensions.scale?.x ?? 1}
                    isSelected={s.id === selectedId}
                    onSelect={() => {
                      selectShape(s.id);
                    }}
                    onChange={(newAttrs) => {
                      const newShapes = shapes.slice();
                      newShapes[i] = newAttrs;
                      setShapes(newShapes);
                      history.unshift(newAttrs)
                    }}
                  />
                );
            }
          })}
          {
            line.map((l, i) => (
              <Line
                key={i}
                points={l.points}
                stroke={l.color}
                strokeWidth={l.thickness}
                tension={0.5}
                lineJoin='round'
                lineCap="round"
                globalCompositeOperation={l.tool === "destination-out" ? "destination-out" : "source-over"}
              />
            ))
          }
        </Layer>
      </Stage>
    </div>
    </>
  )
}

export default KonvaCanvas


