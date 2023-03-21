import React, { useRef, type MutableRefObject } from 'react';
import { Transformer, Rect, Text } from 'react-konva';
import type Konva from 'konva';

type RectProps = {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    id: string
}

type RectangleProps = {
    shapeProps: RectProps, 
    isSelected: boolean, 
    onSelect: () => void, 
    onChange: (shapeProps: RectProps) => void
}

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange } : RectangleProps) => {
  const shapeRef = useRef<Konva.Rect>() as MutableRefObject<Konva.Rect>;
  const trRef = useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
        trRef.current?.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
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

type TextProps = {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    id: string
}

type CanvasTextProps = {
    shapeProps: TextProps, 
    isSelected: boolean, 
    onSelect: () => void, 
    onChange: (shapeProps: TextProps) => void
}

const CanvasText = ({ shapeProps, isSelected, onSelect, onChange } : CanvasTextProps) => {
  const shapeRef = useRef<Konva.Text>() as MutableRefObject<Konva.Text>;
  const trRef = useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
        trRef.current?.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        text={"Text"}
        x={}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
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
          enabledAnchors={['middle-left', 'middle-right']}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export { Rectangle, CanvasText }