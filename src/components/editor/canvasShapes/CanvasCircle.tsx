import React, { useRef, type MutableRefObject, useEffect } from "react";
import { Transformer, Circle } from "react-konva";
import type Konva from "konva";
import { EditorFunctions, type RectangleProps } from "~/types";

const CanvasCircle = ({
  shapeProps,
  isSelected,
  editorFunction,
  onSelect,
  onChange,
  onDelete,
}: RectangleProps) => {
  const shapeRef = useRef<Konva.Circle>() as MutableRefObject<Konva.Circle>;
  const trRef =
    useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;

  useEffect(() => {
    if (isSelected) {
      if (editorFunction === EditorFunctions.Clear) {
        onDelete(shapeProps.id);
      }
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected, editorFunction, onDelete, shapeProps.id]);

  return (
    <React.Fragment>
      <Circle
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default CanvasCircle;
