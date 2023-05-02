import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  type MutableRefObject,
  useCallback,
} from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import type Konva from "konva";
import { type KonvaEventObject } from "konva/lib/Node";
import useDimensions from "~/hooks/useDimensions";
import CanvasText from "./canvasShapes/CanvasText";
import Rectangle from "./canvasShapes/Rectangle";
import { type Vector2d } from "konva/lib/types";
import { v4 } from "uuid";
import {
  CanvasShapes,
  EditorFunctions,
  type KonvaCanvasProps,
  type Shapes,
} from "~/types";
import { toast } from "react-toastify";
import CanvasSticker from "./canvasShapes/CanvasSticker";
import CanvasCircle from "./canvasShapes/CanvasCircle";
import { api } from "~/utils/api";
import { useSessionSpeaker } from "../sessions/SelectedSessionAndSpeaker";
import { useSession } from "next-auth/react";

const KonvaCanvas = ({
  editorFunction,
  template,
  thickness,
  color,
  fontFamily,
  emoji,
  setFunction,
  setStage,
}: KonvaCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>() as MutableRefObject<Konva.Stage>;
  const layerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const staticLayerRef = useRef<Konva.Layer>() as MutableRefObject<Konva.Layer>;
  const [shapes, setShapes] = useState<Shapes[]>(
    ([...template.content] as unknown as Shapes[]) ?? []
  );
  const [selectedId, selectShape] = useState<string | null>(null);
  const { current: history } = useRef<Shapes[]>(
    ([...template.content] as unknown as Shapes[]).reverse() ?? []
  );
  const { anonymous } = useSessionSpeaker().data;
  const user = useSession().data?.user;

  const { mutateAsync: createTemplate } =
    api.templates.createTemplate.useMutation();
  const { mutateAsync: createImage } = api.kudos.createKudoImage.useMutation();

  const [line, setLine] = useState<Shapes[]>([]);

  const isDrawing = useRef(false);

  const dimensions = useDimensions(containerRef);
  const stageDimensions = useMemo(
    () => ({
      width: dimensions?.width,
      height: dimensions?.height,
      scale: dimensions?.scale,
    }),
    [dimensions]
  );

  const undo = useCallback(() => {
    const lastShape = history.shift();
    const shapeToBe = history.find((s) => s.id === lastShape?.id);
    const shape = shapes.find((s) => s.id === lastShape?.id);
    if (!shape) {
      if (lastShape) {
        setShapes((s) => [...s, lastShape]);
      }
      setFunction(EditorFunctions.None);
      return;
    }
    const index = shapes.indexOf(shape);
    if (shapeToBe) {
      shapes[index] = shapeToBe;
    } else {
      if (lastShape?.id === "header") {
        history.unshift(lastShape);
      } else {
        setShapes((s) => s.splice(index, 1));
      }
    }
    setShapes(shapes);

    setFunction(EditorFunctions.None);
  }, [setFunction, history, shapes]);

  const onDelete = (id: string) => {
    const shape = shapes.find((s) => s.id === id);
    if (!shape) {
      return;
    }
    setShapes((s) => s.filter((s) => s.id !== id));

    history.unshift(shape);
    selectShape(null);
    setFunction(EditorFunctions.None);
  };

  const clickListener = (e: KonvaEventObject<Event>) => {
    const clickedOnEmpty = e.target?.getLayer() === staticLayerRef.current;
    if (clickedOnEmpty) {
      selectShape(null);
    }
    switch (editorFunction) {
      case EditorFunctions.Text:
        addText();
        break;
      case EditorFunctions.Sticker:
        addSticker();
        console.log("sticker");

        break;
    }
  };

  const addText = () => {
    const pos = layerRef.current.getRelativePointerPosition() ?? { x: 0, y: 0 };

    const text = makeText(pos);
    history.unshift(text);
    setShapes((s) => [...s, text]);
    selectShape(text.id);
    setFunction(EditorFunctions.None);
  };

  const makeText = (pos: Vector2d) => {
    const text = {
      id: v4(),
      type: CanvasShapes.Text,
      text: "Text",
      fill: color,
      fontFamily: fontFamily,
      x: pos.x,
      y: pos.y,
      fontSize: (stageDimensions?.height ?? 0) / 15,
      draggable: true,
    };
    return text;
  };

  const addSticker = () => {
    debugger;
    if (!emoji) {
      toast.error("No emoji selected");
      return;
    }
    const pos = layerRef.current.getRelativePointerPosition() ?? { x: 0, y: 0 };
    const sticker = {
      id: v4(),
      type: CanvasShapes.Sticker,
      text: emoji.native,
      x: pos.x,
      y: pos.y,
      draggable: true,
      fontSize: (stageDimensions?.height ?? 0) / 5,
    };
    history.unshift(sticker);
    setShapes((s) => [...s, sticker]);
    selectShape(sticker.id);
    setFunction(EditorFunctions.None);
  };

  const saveTemplate = useCallback(async () => {
    setFunction(EditorFunctions.None);
    selectShape(null);
    const image = await createImage({ dataUrl: stageRef.current.toDataURL() });
    await createTemplate({
      name: v4(),
      color: template.color,
      image: image.id,
      content: shapes,
    });
  }, [
    createTemplate,
    shapes,
    stageRef,
    template.color,
    setFunction,
    createImage,
  ]);

  const handleMouseDown = () => {
    if (
      editorFunction === EditorFunctions.Draw ||
      editorFunction === EditorFunctions.Erase
    ) {
      selectShape(null);
      isDrawing.current = true;
      const pos = layerRef.current.getRelativePointerPosition() ?? {
        x: 0,
        y: 0,
      };
      setLine([
        ...line,
        {
          type: CanvasShapes.Line,
          id: v4(),
          tool:
            editorFunction === EditorFunctions.Erase
              ? "destination-out"
              : "source-over",
          points: [pos.x, pos.y],
          thickness: thickness,
          color: color,
        },
      ]);
    }
  };

  const handleMouseMove = () => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const point = layerRef.current.getRelativePointerPosition() ?? {
      x: 0,
      y: 0,
    };
    if (line) {
      const lastLine = line[line.length - 1] ?? {
        type: CanvasShapes.Line,
        id: "1",
        tool: "source-over",
        points: [0, 0],
        thickness: thickness,
        color: color,
      };
      // add point
      lastLine.points = lastLine.points?.concat([point.x, point.y]);

      // replace last
      line.splice(line.length - 1, 1, lastLine);
      setLine(line.concat());
    }
  };

  const handleMouseUp = () => {
    if (line.length > 0) {
      const newShape = line.pop();
      if (newShape) {
        history.unshift(newShape);
        setShapes((s) => [...s, newShape]);
      }
      setLine([]);
    }
    isDrawing.current = false;
  };

  useEffect(() => {
    setStage(stageRef.current);
    layerRef.current.offset({
      x: -(stageDimensions?.width ?? 0) / 2,
      y: -(stageDimensions?.height ?? 0) / 2,
    });
  }, [setStage, stageDimensions]);

  useEffect(() => {
    if (editorFunction === EditorFunctions.Submit) {
      selectShape(null);
    }
    if (editorFunction === EditorFunctions.Undo) {
      undo();
    }
    if (editorFunction === EditorFunctions.Save) {
      saveTemplate().catch(console.error);
    }
  }, [editorFunction, undo, saveTemplate]);

  useEffect(() => {
    if (!template || !stageDimensions.height) {
      return;
    }
    if (!anonymous) {
      const senderNode = {
        id: "Sender",
        type: CanvasShapes.Text,
        x: 0,
        y: 460,
        text: `Sent by ${user?.name ?? ""}`,
        fill: color,
        fontFamily: fontFamily,
        fontSize: (stageDimensions?.height ?? 0) * 0.05,
        draggable: true,
      };
      history.unshift(senderNode);
      setShapes((s) => [...s, senderNode]);
    }
  }, [
    template,
    stageDimensions,
    anonymous,
    user?.name,
    color,
    fontFamily,
    history,
  ]);

  return (
    <>
      <div
        ref={containerRef}
        id="kudo"
        className="aspect-[3/2] max-h-full w-full max-w-xl overflow-hidden rounded-3xl bg-neutral shadow-2xl lg:max-w-3xl"
      >
        <Stage
          ref={stageRef}
          width={
            (stageDimensions?.width ?? 1) * (stageDimensions.scale?.x ?? 1)
          }
          height={
            (stageDimensions?.height ?? 1) * (stageDimensions.scale?.y ?? 1)
          }
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
          <Layer ref={layerRef}>
            <Rectangle
              key="Background"
              shapeProps={{
                type: CanvasShapes.Rect,
                id: "Background",
                width: stageDimensions?.width,
                height: stageDimensions?.height,
                fill: template.color,
              }}
              isSelected={false}
              editorFunction={EditorFunctions.None}
              onSelect={() => void 0}
              onChange={() => void 0}
              onDelete={() => void 0}
            />
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
                      lineJoin="round"
                      lineCap="round"
                      globalCompositeOperation={
                        s.tool === "destination-out"
                          ? "destination-out"
                          : "source-over"
                      }
                    />
                  );
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
                        history.unshift(newAttrs);
                      }}
                      areaPosition={{
                        x:
                          (stageRef.current?.container().offsetLeft ?? 0) +
                          (stageRef.current?.width() ?? 0) / 2 +
                          (s.x ?? 1) * (stageDimensions?.scale?.x ?? 1),
                        y:
                          (stageRef.current?.container().offsetTop ?? 0) +
                          (stageRef.current?.height() ?? 0) / 2 +
                          (s.y ?? 1) * (stageDimensions?.scale?.y ?? 1),
                      }}
                      onDelete={onDelete}
                      editorFunction={editorFunction ?? EditorFunctions.None}
                    />
                  );
                case CanvasShapes.Sticker:
                  return (
                    <CanvasSticker
                      key={i}
                      shapeProps={s}
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
                        history.unshift(newAttrs);
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
                      isSelected={s.id === selectedId}
                      editorFunction={editorFunction ?? EditorFunctions.None}
                      onSelect={() => {
                        selectShape(s.id);
                      }}
                      onChange={(newAttrs) => {
                        const newShapes = shapes.slice();
                        newShapes[i] = newAttrs;
                        setShapes(newShapes);
                        history.unshift(newAttrs);
                      }}
                      onDelete={onDelete}
                    />
                  );
                case CanvasShapes.Circle:
                  return (
                    <CanvasCircle
                      key={i}
                      shapeProps={s}
                      isSelected={s.id === selectedId}
                      editorFunction={editorFunction ?? EditorFunctions.None}
                      onSelect={() => {
                        selectShape(s.id);
                      }}
                      onChange={(newAttrs) => {
                        const newShapes = shapes.slice();
                        newShapes[i] = newAttrs;
                        setShapes(newShapes);
                        history.unshift(newAttrs);
                      }}
                      onDelete={onDelete}
                    />
                  );
              }
            })}
            {line.map((l, i) => (
              <Line
                key={i}
                points={l.points}
                stroke={l.color}
                strokeWidth={l.thickness}
                tension={0.5}
                lineJoin="round"
                lineCap="round"
                globalCompositeOperation={
                  l.tool === "destination-out"
                    ? "destination-out"
                    : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default KonvaCanvas;
