import React, { useRef, type MutableRefObject, useEffect } from 'react';
import { Transformer, Text } from 'react-konva';
import type Konva from 'konva';
import { EditorFunctions, type CanvasStickerProps } from '~/types';


const CanvasSticker = ({ shapeProps, isSelected, editorFunction, onSelect, onChange, onDelete, onChangeEnd }: CanvasStickerProps) => {
  const shapeRef = useRef<Konva.Text>() as MutableRefObject<Konva.Text>;
  const trRef = useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;
  // const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isSelected) {
      if (editorFunction === EditorFunctions.Clear) {
        onDelete(shapeProps.id)
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
  }, [shapeProps.text]);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={(!shapeProps.draggable) ? false : isSelected}
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
          })
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
          onChangeEnd(shapeProps)
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorX={0.5}
          anchorY={0.5}
          enabledAnchors={shapeProps.draggable ? ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'] : []}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(10, newBox.width);
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default CanvasSticker;