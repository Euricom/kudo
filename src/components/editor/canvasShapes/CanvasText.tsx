import React, { useRef, type MutableRefObject, useEffect } from "react";
import { Transformer, Text } from "react-konva";
import type Konva from "konva";
import { editText, editText2 } from "../editText";
import { EditorFunctions, type CanvasTextProps } from "~/types";
import useWindowDimensions from "~/hooks/useWindowDimensions";

const CanvasText = ({
  container,
  shapeProps,
  scale,
  isSelected,
  areaPosition,
  editorFunction,
  dialog,
  onSelect,
  onChange,
  onDelete,
  onChangeEnd,
}: CanvasTextProps) => {
  const shapeRef = useRef<Konva.Text>() as MutableRefObject<Konva.Text>;
  const trRef =
    useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;
  const viewport = useWindowDimensions().width;

  useEffect(() => {
    if (isSelected) {
      if (editorFunction === EditorFunctions.Clear) {
        onDelete(shapeProps.id);
      }

      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected, onDelete, shapeProps, editorFunction]);

  useEffect(() => {
    if (shapeRef.current) {
      const shapeWidth = shapeRef.current.width();
      const shapeHeight = shapeRef.current.height();
      const xOffset = shapeWidth / 2;
      const yOffset = shapeHeight / 2;
      shapeRef.current.offset({ x: xOffset, y: yOffset });
    }
  });

  const onEditText = () => {
    shapeRef.current.hide();
    trRef.current?.hide();
    // editText2(
    //   areaPosition,
    //   shapeRef.current,
    //   trRef.current,
    //   scale,
    //   onTextChange,
    //   container
    // );
    dialog?.showModal();
    editText(shapeRef.current, trRef.current, scale, onTextChange, dialog);
  };

  const handleClick = () => {
    if (
      EditorFunctions.Draw === editorFunction ||
      EditorFunctions.Erase === editorFunction
    ) {
      return;
    }
    onSelect();
    if (viewport > 1024) {
      if (isSelected) onEditText();
    } else onEditText();
  };

  const onTextChange = (text: string) => {
    onChange({
      ...shapeProps,
      text: text,
    });
    onChangeEnd({
      ...shapeProps,
      text: text,
    });
  };

  return (
    <React.Fragment>
      <Text
        onClick={handleClick}
        onTap={handleClick}
        ref={shapeRef}
        {...shapeProps}
        draggable={
          shapeProps.draggable &&
          EditorFunctions.Draw !== editorFunction &&
          EditorFunctions.Erase !== editorFunction
        }
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
          onChangeEnd({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          // transformer is changing scale of the node
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          onChange({
            ...shapeProps,
            rotation: node.rotation(),
            scale: node.scale(),
            x: node.x(),
            y: node.y(),
          });
        }}
        onTransformEnd={() => {
          onChangeEnd(shapeProps);
        }}
      />
      {isSelected && viewport > 1024 && (
        <Transformer
          ref={trRef}
          anchorX={0.5}
          anchorY={0.5}
          enabledAnchors={
            shapeProps.draggable
              ? [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]
              : []
          }
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default CanvasText;
