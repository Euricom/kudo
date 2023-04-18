import React, { useRef, type MutableRefObject, useEffect } from 'react';
import { Transformer, Text } from 'react-konva';
import type Konva from 'konva';
import editText from '../editText';
import { EditorFunctions, type CanvasTextProps } from '~/types';


const CanvasText = ({ container, shapeProps, scale, isSelected, onSelect, onChange, areaPosition, onDelete, editorFunction, onChangeEnd }: CanvasTextProps) => {
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

  const onDoubleClick = () => {
    shapeRef.current.hide();
    trRef.current?.hide();
    editText(areaPosition, shapeRef.current, trRef.current, scale, onTextChange, container)
  }

  const onTextChange = (text: string) => {
    onChange({
      ...shapeProps,
      text: text
    })
    onChangeEnd({
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