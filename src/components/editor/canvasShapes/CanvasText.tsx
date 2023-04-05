import React, { useRef, type MutableRefObject, useEffect } from 'react';
import { Transformer, Text } from 'react-konva';
import type Konva from 'konva';
import editText from '../editText';
import { type CanvasTextProps } from '~/types';


const CanvasText = ({ shapeProps, scale, isSelected, onSelect, onChange, areaPosition, fontSize }: CanvasTextProps) => {
  const shapeRef = useRef<Konva.Text>() as MutableRefObject<Konva.Text>;
  const trRef = useRef<Konva.Transformer>() as MutableRefObject<Konva.Transformer>;
  // const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const onDoubleClick = () => {
    shapeRef.current.hide();
    trRef.current.hide();
    editText(areaPosition, shapeRef.current, trRef.current, scale, onTextChange)
  }

  const onTextChange = (text: string) => {
    onChange({
      ...shapeProps,
      text: text
    })
  }

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        ref={shapeRef}
        {...shapeProps}
        fontSize={fontSize}
        draggable={isSelected}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
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
          anchorX={0.5}
          anchorY={0.5}
          enabledAnchors={['middle-left', 'middle-right', 'bottom-center']}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
        />
      )}
      {/* {isEditing && (
        <TextEdit textNode={shapeRef.current} tr={trRef.current} areaPosition={areaPosition}/>
      )} */}
    </React.Fragment>
  );
};

export default CanvasText;