import React, { useRef, type MutableRefObject, useEffect } from "react";
import { Transformer, Image } from "react-konva";
import type Konva from "konva";
import { EditorFunctions, type CanvasImageProps } from "~/types";
import useWindowDimensions from "~/hooks/useWindowDimensions";

const CanvasImage = ({
  shapeProps,
  isSelected,
  editorFunction,
  onSelect,
  onChange,
  onDelete,
}: CanvasImageProps) => {
  const shapeRef = useRef<Konva.Image>() as MutableRefObject<Konva.Image>;
  const trRef =
    useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;

  const viewport = useWindowDimensions().width;

  const image = new window.Image();
  image.src = shapeProps.image ?? "";

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

  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        image={image}
        alt={shapeProps.image}
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
            rotation: node.rotation(),
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && viewport > 1024 && (
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

export default CanvasImage;
